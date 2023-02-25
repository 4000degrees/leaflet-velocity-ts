import ColorScale from "./colorScale";
import Particle from "./particle";
import Vector from "./vector";
export default class AnimationBucket {
    private colorScale;
    private buckets;
    constructor(colorScale: ColorScale);
    clear(): void;
    add(p: Particle, v: Vector): void;
    draw(context2D: CanvasRenderingContext2D): void;
}
