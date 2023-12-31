import * as L from "leaflet";
import { VelocityControlOptions } from "./models/velocity-control-options.model";
export default class VelocityControl extends L.Control {
    _container: HTMLElement;
    _map: L.Map;
    options: VelocityControlOptions;
    onAdd(map: L.Map): HTMLElement;
    onRemove(map: L.Map): void;
    _onMouseMove(e: L.LeafletMouseEvent): void;
}
export declare const ExtendedLControl: typeof L.Control & {
    Velocity: (new (...args: any[]) => VelocityControl) & typeof L.Control;
};
export declare const extendedLControl: typeof L.control & {
    velocity: (options: VelocityControlOptions) => VelocityControl & L.Control;
};
