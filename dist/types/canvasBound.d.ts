import Particule from "./particle";
export default class CanvasBound {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
    constructor(xMin: number, yMin: number, xMax: number, yMax: number);
    get width(): number;
    get height(): number;
    getRandomParticule(maxAge: number): Particule;
    resetParticule(p: Particule): Particule;
}
