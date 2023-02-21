export default class ColorScale {
    private scale;
    private minValue;
    private maxValue;
    constructor(minValue: number, maxValue: number, scale?: string[]);
    setMinMax(minValue: number, maxValue: number): void;
    get size(): number;
    getColorIndex(value: number): number;
    colorAt(index: number): string;
    getColor(value: number): string;
}
