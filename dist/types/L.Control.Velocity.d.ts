import * as L from "leaflet";
import VelocityLayer from "./L.VelocityLayer";
export type AngleConversion = "bearingCW" | "bearingCCW" | "meteoCW" | "meteoCCW";
export type VelocityUnit = "k/h" | "kt" | "mph" | "m/s";
export interface VelocityControlOptions {
    position: "topleft" | "topright" | "bottomleft" | "bottomright";
    emptyString: string;
    angleConvention: AngleConversion;
    showCardinal: boolean;
    speedUnit: VelocityUnit;
    directionString: string;
    speedString: string;
    velocityType: string;
    leafletVelocity?: VelocityLayer;
    onAdd?: () => void;
    onRemove?: () => void;
}
export default class VelocityControl extends L.Control {
    _container: HTMLElement;
    _map: L.Map;
    options: VelocityControlOptions;
    onAdd(map: L.Map): HTMLElement;
    onRemove(map: L.Map): void;
    vectorToSpeed(uMs: number, vMs: number, unit: VelocityUnit): number;
    vectorToDegrees(uMs: number, vMs: number, angleConvention: AngleConversion): number;
    degreesToCardinalDirection(deg: number): string;
    meterSec2Knots(meters: number): number;
    meterSec2kilometerHour(meters: number): number;
    meterSec2milesHour(meters: number): number;
    _onMouseMove(e: L.LeafletMouseEvent): void;
}
export declare const ExtendedLControl: typeof L.Control & {
    Velocity: (new (...args: any[]) => VelocityControl) & typeof L.Control;
};
export declare const extendedLControl: typeof L.control & {
    velocity: (options: VelocityControlOptions) => VelocityControl & L.Control;
};
