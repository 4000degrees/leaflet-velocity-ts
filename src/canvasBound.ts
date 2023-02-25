import Particle from "./particle";

export default class CanvasBound {
  public xMin: number;
  public yMin: number;
  public xMax: number;
  public yMax: number;

  constructor(xMin: number, yMin: number, xMax: number, yMax: number) {
    this.xMin = xMin;
    this.yMin = yMin;
    this.xMax = xMax;
    this.yMax = yMax;
  }

  get width(): number {
    return this.xMax - this.xMin;
  }

  get height(): number {
    return this.yMax - this.yMin;
  }

  getRandomParticle(maxAge: number): Particle {
    const x = Math.round(Math.floor(Math.random() * this.width) + this.xMin);
    const y = Math.round(Math.floor(Math.random() * this.height) + this.yMin);
    return new Particle(x, y, maxAge);
  }

  resetParticle(p: Particle): Particle {
    const x = Math.round(Math.floor(Math.random() * this.width) + this.xMin);
    const y = Math.round(Math.floor(Math.random() * this.height) + this.yMin);
    p.reset(x, y);
    return p;
  }
}
