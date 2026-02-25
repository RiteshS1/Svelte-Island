/**
 * Single source of truth for 3D scene: model paths, positions, scales.
 * Terrain is placed below the penguin; penguin sits on the visible "ground" level.
 */

export const MODEL_PATHS = {
	penguin: {
		black: '/assets/models/pudgy_penguin.glb',
		emperor: '/assets/models/emperor_penguin.glb',
		dancing: '/assets/models/dancing_penguin.glb'
	},
	terrain: '/assets/models/snow_terrain_low_poly.glb'
} as const;

export type PenguinModelType = keyof typeof MODEL_PATHS.penguin;

/** Default penguin when no lesson is selected */
export const DEFAULT_PENGUIN_PATH = MODEL_PATHS.penguin.black;

/** Terrain: lowered so it sits clearly below the penguin (mountain base in the distance) */
export const TERRAIN_POSITION: [number, number, number] = [0, -6, 0];
export const TERRAIN_SCALE: [number, number, number] = [3, 3, 3];

/** Penguin positions: black (pudgy) has a base; emperor/dancing are animated models, slightly raised. */
export const PENGUIN_POSITION_BLACK: [number, number, number] = [-2.5, 0.2, 0];
export const PENGUIN_POSITION_EMPEROR: [number, number, number] = [-2.5, 1.2, 0];
export const PENGUIN_POSITION_DANCING: [number, number, number] = [-2.5, 0, 0];

/** Base scale for black (pudgy) penguin. Emperor/dancing are scaled down to match. */
export const PENGUIN_SCALE_BLACK: [number, number, number] = [1, 1, 1];
/** Emperor/dancing models are larger in file; scale down to match pudgy size. */
export const PENGUIN_SCALE_EMPEROR: [number, number, number] = [0.0028, 0.0028, 0.0028];
export const PENGUIN_SCALE_DANCING: [number, number, number] = [0.0028, 0.0028, 0.0028];

export function getPenguinModelPath(modelType: PenguinModelType): string {
	return MODEL_PATHS.penguin[modelType];
}

export function getPenguinScale(modelType: PenguinModelType): [number, number, number] {
	switch (modelType) {
		case 'black':
			return [...PENGUIN_SCALE_BLACK];
		case 'emperor':
			return [...PENGUIN_SCALE_EMPEROR];
		case 'dancing':
			return [...PENGUIN_SCALE_DANCING];
		default:
			return [...PENGUIN_SCALE_BLACK];
	}
}

export function getPenguinPosition(modelType: PenguinModelType): [number, number, number] {
	switch (modelType) {
		case 'black':
			return [...PENGUIN_POSITION_BLACK];
		case 'emperor':
			return [...PENGUIN_POSITION_EMPEROR];
		case 'dancing':
			return [...PENGUIN_POSITION_DANCING];
		default:
			return [...PENGUIN_POSITION_BLACK];
	}
}

/** Sky background colors (hex). Day = arctic morning; night = dark sky. */
export const SKY_COLOR_DAY = 0xe0f2fe;
export const SKY_COLOR_NIGHT = 0x0f172a;

/** @deprecated Use getSkyColor(skyPhase) or SKY_COLOR_DAY. Kept for backwards compatibility. */
export const SKY_BACKGROUND_COLOR = SKY_COLOR_DAY;

export type SkyPhase = 'day' | 'night';

export function getSkyColor(skyPhase: SkyPhase): number {
	return skyPhase === 'night' ? SKY_COLOR_NIGHT : SKY_COLOR_DAY;
}
