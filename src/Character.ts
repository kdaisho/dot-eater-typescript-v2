export class Character {
	[index: number]: object;
	aa?: string;
	ai?: number;
	pos?: object;
	lastPos = {};
	constructor(aa: string) {
		this.aa = aa;
	}
}

// export class Enemies extends Character {
// 	// [index: number]: object;
// 	[index: number]: { ai: number | undefined; pos: object | undefined };
// 	ai: number | undefined;
// 	pos: object | undefined;
// }

export default Character;