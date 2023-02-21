export default class Particule {
    x: number;
    y: number;
    age: number;
    maxAge: number;
    xt: number;
    yt: number;
    intensity: number;
    constructor(x: number, y: number, maxAge: number);
    reset(x: number, y: number): void;
    get isDead(): boolean;
    grow(): void;
}
