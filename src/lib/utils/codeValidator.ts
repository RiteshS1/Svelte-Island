/**
 * Semantic code-answer validation via Acorn AST.
 * Ignores whitespace / semicolons and treats commutative * and + as equivalent.
 */

import * as acorn from 'acorn';
import type { Node, Program, BinaryExpression, CallExpression, Identifier } from 'acorn';

export type ValidateCodeResult =
	| { ok: true }
	| { ok: false; reason: string; syntaxError?: boolean };

const COMMUTATIVE = new Set(['*', '+']);

/** Pull `<script>` bodies (and leave the rest for template checks). */
function extractScriptBodies(source: string): string {
	const bodies: string[] = [];
	const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
	let m: RegExpExecArray | null;
	while ((m = re.exec(source)) !== null) {
		bodies.push(m[1]);
	}
	return bodies.length > 0 ? bodies.join('\n') : source;
}

function tryParse(js: string): { program: Program } | { error: string } {
	const attempts = [
		js,
		// Incomplete snippets often omit wrapping; try as module / script
		js.trim()
	];
	let lastMsg = 'Could not parse your code.';
	for (const src of attempts) {
		try {
			const program = acorn.parse(src, {
				ecmaVersion: 'latest',
				sourceType: 'module',
				allowAwaitOutsideFunction: true,
				allowReturnOutsideFunction: true
			}) as Program;
			return { program };
		} catch (e) {
			lastMsg = e instanceof Error ? e.message : String(e);
		}
		try {
			const program = acorn.parse(src, {
				ecmaVersion: 'latest',
				sourceType: 'script',
				allowAwaitOutsideFunction: true,
				allowReturnOutsideFunction: true
			}) as Program;
			return { program };
		} catch (e) {
			lastMsg = e instanceof Error ? e.message : String(e);
		}
	}
	return { error: lastMsg };
}

function isAstNode(value: unknown): value is Node {
	return !!value && typeof value === 'object' && 'type' in value && typeof (value as Node).type === 'string';
}

function walk(node: Node, visit: (n: Node) => void): void {
	visit(node);
	for (const key of Object.keys(node)) {
		if (key === 'loc' || key === 'start' || key === 'end') continue;
		const child = (node as unknown as Record<string, unknown>)[key];
		if (!child || typeof child !== 'object') continue;
		if (Array.isArray(child)) {
			for (const c of child) {
				if (isAstNode(c)) walk(c, visit);
			}
		} else if (isAstNode(child)) {
			walk(child, visit);
		}
	}
}

function calleeName(node: CallExpression): string | null {
	const c = node.callee;
	if (c.type === 'Identifier') return c.name;
	return null;
}

function literalKey(node: Node): string | null {
	if (node.type === 'Literal') {
		return JSON.stringify((node as acorn.Literal).value);
	}
	if (node.type === 'Identifier') return `id:${(node as Identifier).name}`;
	return null;
}

/** Structural fingerprint for expressions; * and + are order-insensitive. */
function exprFingerprint(node: Node): string {
	switch (node.type) {
		case 'Identifier':
			return `id:${(node as Identifier).name}`;
		case 'Literal':
			return `lit:${JSON.stringify((node as acorn.Literal).value)}`;
		case 'BinaryExpression': {
			const bin = node as BinaryExpression;
			const op = bin.operator;
			const left = exprFingerprint(bin.left as Node);
			const right = exprFingerprint(bin.right as Node);
			if (COMMUTATIVE.has(op)) {
				const [a, b] = [left, right].sort();
				return `bin:${op}(${a},${b})`;
			}
			return `bin:${op}(${left},${right})`;
		}
		case 'UnaryExpression': {
			const u = node as acorn.UnaryExpression;
			return `unary:${u.operator}(${exprFingerprint(u.argument as Node)})`;
		}
		case 'CallExpression': {
			const call = node as CallExpression;
			const name = calleeName(call) ?? '?';
			const args = call.arguments.map((a) => exprFingerprint(a as Node)).join(',');
			return `call:${name}(${args})`;
		}
		case 'MemberExpression': {
			const mem = node as acorn.MemberExpression;
			return `mem:${exprFingerprint(mem.object as Node)}.${exprFingerprint(mem.property as Node)}`;
		}
		default:
			return `node:${node.type}`;
	}
}

function collectCallFingerprints(program: Program): string[] {
	const out: string[] = [];
	walk(program, (n) => {
		if (n.type === 'CallExpression') {
			out.push(exprFingerprint(n));
		}
	});
	return out;
}

function hasObjectProperty(program: Program, key: string, value: string): boolean {
	let found = false;
	const wantVal = JSON.stringify(value);
	walk(program, (n) => {
		if (n.type !== 'Property') return;
		const prop = n as acorn.Property;
		let keyName: string | null = null;
		if (prop.key.type === 'Identifier') keyName = prop.key.name;
		else if (prop.key.type === 'Literal') keyName = String(prop.key.value);
		if (keyName !== key) return;
		if (literalKey(prop.value as Node) === wantVal) found = true;
	});
	return found;
}

function normalizeTemplate(src: string): string {
	return src.replace(/\s+/g, ' ').trim();
}

function hasDirective(userCode: string, name: string): boolean {
	// Match {#each ...} or {#if ...} ignoring extra whitespace inside braces
	const re = new RegExp(`\\{\\s*#\\s*${name}\\b`, 'i');
	return re.test(userCode);
}

/**
 * Validate user submission against a compact solution pattern from tests.ts.
 * Patterns currently used:
 *  - `#each` / `#if` — Svelte block directives
 *  - `$props()` / `$state(0)` / `$derived(count * 2)` — rune calls (AST)
 *  - `message: 'Hello'` / `user: 'Explorer'` — object properties (AST)
 */
export function validateCodeAnswer(userCode: string, solutionCode: string): ValidateCodeResult {
	const raw = userCode ?? '';
	const solution = (solutionCode ?? '').trim();
	if (!raw.trim()) {
		return { ok: false, reason: 'Write some code before checking your answer.' };
	}
	if (!solution) {
		return { ok: false, reason: 'No solution configured for this question.' };
	}

	// Template directives — no full JS parse required
	if (solution.startsWith('#')) {
		const name = solution.slice(1).trim();
		if (hasDirective(raw, name)) return { ok: true };
		return {
			ok: false,
			reason: `Your answer should include a {#${name} ...} block.`
		};
	}

	const script = extractScriptBodies(raw);
	const parsed = tryParse(script);
	if ('error' in parsed) {
		return {
			ok: false,
			syntaxError: true,
			reason: `Syntax error — fix your JavaScript and try again. (${parsed.error})`
		};
	}
	const { program } = parsed;

	// Object property patterns: `message: 'Hello'`
	const propMatch = /^(\w+)\s*:\s*['"]([^'"]*)['"]\s*$/.exec(solution);
	if (propMatch) {
		const [, key, val] = propMatch;
		if (hasObjectProperty(program, key, val)) return { ok: true };
		// Also accept double/single quote variants in source via AST only
		return {
			ok: false,
			reason: `Expected an object with ${key}: '${val}'.`
		};
	}

	// Rune / call expression patterns — parse solution as an expression
	try {
		const solProgram = acorn.parse(`(${solution})`, {
			ecmaVersion: 'latest',
			sourceType: 'module'
		}) as Program;
		const solExpr = (solProgram.body[0] as acorn.ExpressionStatement)?.expression;
		if (!solExpr) {
			return { ok: false, reason: 'Invalid solution pattern.' };
		}
		const want = exprFingerprint(solExpr as Node);
		const calls = collectCallFingerprints(program);
		// Also accept the expression appearing as a full statement fingerprint match
		let found = calls.some((fp) => fp === want);
		if (!found) {
			walk(program, (n) => {
				if (exprFingerprint(n) === want) found = true;
			});
		}
		// Soften $state(0): any $state(...) call counts if solution is $state(0)
		if (!found && want.startsWith('call:$state(')) {
			found = calls.some((fp) => fp.startsWith('call:$state('));
		}
		// Soften $props(): any $props() call
		if (!found && want.startsWith('call:$props(')) {
			found = calls.some((fp) => fp.startsWith('call:$props('));
		}
		if (found) return { ok: true };
		return {
			ok: false,
			reason: `Your code doesn't match the expected pattern (${solution}). Check names, runes, and expressions (order of * and + is flexible).`
		};
	} catch {
		// Fallback: normalized substring (last resort, still whitespace-tolerant)
		const normUser = normalizeTemplate(raw).replace(/\s*;\s*/g, ';');
		const normSol = normalizeTemplate(solution).replace(/\s*;\s*/g, ';');
		if (normUser.includes(normSol)) return { ok: true };
		return {
			ok: false,
			reason: `Could not match solution pattern "${solution}".`
		};
	}
}
