import Vector from "./vector";
import Grid from "./grid";
import Particle from "./particle";
import Layer from "./layer";
import { GfsDataset } from "./models/gfs-dataset.model";
export interface WindyOptions {
    canvas: HTMLCanvasElement;
    data: GfsDataset;
    minVelocity?: number;
    maxVelocity?: number;
    colorScale?: string[];
    velocityScale?: number;
    particleAge?: number;
    particleMultiplier?: number;
    lineWidth?: number;
    frameRate?: number;
}
export default class Windy {
    grid: Grid;
    private canvas;
    private colorScale;
    private velocityScale;
    private particleMultiplier;
    private particleAge;
    private particleLineWidth;
    private autoColorRange;
    private layer;
    private particles;
    private animationBucket;
    private context2D;
    private animationLoop;
    private frameTime;
    private then;
    constructor(options: WindyOptions);
    get particleCount(): number;
    /**
     * Load data
     * @param data
     */
    setData(data: GfsDataset): void;
    getParticleWind(p: Particle): Vector;
    start(layer: Layer): void;
    frame(): void;
    evolve(): void;
    draw(): void;
    stop(): void;
}
