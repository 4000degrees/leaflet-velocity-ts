import Particle from "./particle";
export default class CanvasBound {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
    constructor(xMin: number, yMin: number, xMax: number, yMax: number);
    get width(): number;
    get height(): number;
    getRandomParticle(maxAge: number): Particle;
    resetParticle(p: Particle): Particle;
}
