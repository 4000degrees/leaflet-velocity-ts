export default class MapBound {
    south: number;
    north: number;
    east: number;
    west: number;
    constructor(north: number, east: number, south: number, west: number);
    get width(): number;
    get height(): number;
}
