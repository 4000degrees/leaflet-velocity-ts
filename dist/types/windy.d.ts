import Vector from "./vector";
import Grid from "./grid";
import Particule from "./particle";
import Layer from "./layer";
import { GfsDataset } from "./gfs-dataset.model";
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
    private particuleMultiplier;
    private particleAge;
    private particuleLineWidth;
    private autoColorRange;
    private layer;
    private particules;
    private animationBucket;
    private context2D;
    private animationLoop;
    private frameTime;
    private then;
    constructor(options: WindyOptions);
    get particuleCount(): number;
    /**
     * Load data
     * @param data
     */
    setData(data: GfsDataset): void;
    getParticuleWind(p: Particule): Vector;
    start(layer: Layer): void;
    frame(): void;
    evolve(): void;
    draw(): void;
    stop(): void;
}
