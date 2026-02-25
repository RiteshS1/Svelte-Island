<script lang="ts">
	import { game } from '$lib/state/game.svelte'
	import { useTask, useThrelte } from '@threlte/core'
	import gsap from 'gsap'
	import * as THREE from 'three'

	const { scene, size } = useThrelte();

	// Skybox: ray direction from camera to fragment (world space) — works for any enclosing mesh
	const vertexShader = `
		varying vec2 vUv;
		varying vec3 vWorldPosition;
		void main() {
			vUv = uv;
			vec4 worldPos = modelMatrix * vec4(position, 1.0);
			vWorldPosition = worldPos.xyz;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`;

	// Shadertoy aurora: rd = view ray from camera, uv.y from rd.y for sky gradient
	const fragmentShader = `
		uniform float u_time;
		uniform vec2 u_resolution;
		uniform float u_auroraVisibility;
		varying vec2 vUv;
		varying vec3 vWorldPosition;

		float random(vec2 p) {
			vec3 p3 = fract(vec3(p.xyx) * .1031);
			p3 += dot(p3, p3.yzx + 33.33);
			return fract((p3.x + p3.y) * p3.z);
		}

		mat2 mm2(in float a) { float c = cos(a), s = sin(a); return mat2(c,s,-s,c); }
		float tri(in float x) { return abs(fract(x)-.5); }
		vec2 tri2(in vec2 p) { return vec2(tri(p.x)+tri(p.y), tri(p.y+tri(p.x))); }

		float fbmAurora(vec2 p, float spd) {
			float z = 1.8;
			float z2 = 2.5;
			float rz = 0.;
			p *= mm2(p.x * 0.06);
			vec2 bp = p;
			for (float i = 0.; i < 5.; i++) {
				vec2 dg = tri2(bp*1.85)*.75;
				dg *= mm2(u_time*spd);
				p -= dg/z2;
				bp *= 1.3;
				z2 *= .45;
				z *= .42;
				p *= 1.21 + (rz-1.0)*.02;
				rz += tri(p.x+tri(p.y))*z;
				p *= mm2(u_time * 0.01);
			}
			return clamp(1. / pow(rz * 20., 1.3), 0., 1.);
		}

		vec4 aurora(vec3 rd) {
			vec4 col = vec4(0);
			vec4 avgCol = vec4(0);
			for (float i = 0.; i < 60.; i++) {
				float of = 0.006*random(gl_FragCoord.xy)*smoothstep(0.,15., i);
				float pt = ((.8+pow(i,1.4)*.002)) / (rd.y * 2. + 0.4);
				pt -= of;
				vec3 bpos = 5.5 + pt * rd;
				vec2 p = bpos.zx;
				float rzt = fbmAurora(p, 0.02);
				vec4 col2 = vec4(0,0,0, rzt);
				col2.rgb = (sin(1.-vec3(2.15,-.5, 1.2) + i * 0.043) * 0.5 + 0.5)*rzt;
				avgCol = mix(avgCol, col2, .5);
				col += avgCol * exp2(-i*0.065 - 2.5) * smoothstep(0., 5., i);
			}
			col *= (clamp(rd.y*15.+.4, 0., 1.));
			return smoothstep(0., 1.1, pow(col, vec4(1.))*1.5);
		}

		void setSkyColor(vec2 uv, out vec3 color, vec3 dir) {
			color = mix(vec3(0.006,0.026,0.095), vec3(0.007,0.011,0.035), uv.y);
			color += aurora(dir).rgb;
		}

		void main() {
			vec3 rd = normalize(vWorldPosition - cameraPosition);
			vec2 uv = vec2(0.5, rd.y * 0.5 + 0.5);

			vec3 nightColor = vec3(0.0);
			setSkyColor(uv, nightColor, rd);
			vec3 dayColor = vec3(0.878, 0.949, 0.996);

			vec3 color = mix(dayColor, nightColor, u_auroraVisibility);

			color = pow(color, vec3(1. / 2.2));
			color = smoothstep(0., 1., color);

			gl_FragColor = vec4(color, 1.0);
		}
	`;

	const uniforms = {
		u_time: { value: 0 },
		u_resolution: { value: new THREE.Vector2(1920, 1080) },
		u_auroraVisibility: { value: 0 }
	};

	const material = new THREE.ShaderMaterial({
		vertexShader,
		fragmentShader,
		uniforms,
		transparent: false,
		depthWrite: false,
		side: THREE.BackSide,
		depthTest: true
	});

	// Skybox: large sphere enclosing the whole scene; camera is inside, we render the inner surface
	const SKYBOX_RADIUS = 400;
	const geometry = new THREE.SphereGeometry(SKYBOX_RADIUS, 64, 40);
	const auroraMesh = new THREE.Mesh(geometry, material);
	auroraMesh.position.set(0, 0, 0);
	auroraMesh.renderOrder = -1;

	useTask((delta) => {
		uniforms.u_time.value += delta;
	});

	$effect(() => {
		const phase = game.skyPhase;
		const target = phase === 'night' ? 1 : 0.7;
		gsap.to(uniforms.u_auroraVisibility, {
			value: target,
			duration: 1.2,
			ease: 'power2.inOut',
			overwrite: true
		});
	});

	$effect(() => {
		const s = size?.current;
		if (s) {
			uniforms.u_resolution.value.set(s.width, s.height);
		}
	});

	$effect(() => {
		if (!scene) return;
		scene.add(auroraMesh);
		return () => {
			scene.remove(auroraMesh);
			geometry.dispose();
			material.dispose();
		};
	});
</script>
