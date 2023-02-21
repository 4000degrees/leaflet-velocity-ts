import Windy, { WindyOptions } from "./windy";
import * as L from "leaflet";
import { VelocityControlOptions } from "./L.Control.Velocity";
import { GfsDataset } from "./gfs-dataset.model";
export interface VelocityLayerOptions extends Partial<WindyOptions> {
    displayValues: boolean;
    displayOptions: VelocityControlOptions;
    data: GfsDataset;
    onAdd?: () => void;
    onRemove?: () => void;
}
export default class VelocityLayer extends L.Layer {
    options: VelocityLayerOptions;
    windy: Windy;
    _map: L.Map;
    private _canvasLayer;
    private _context;
    private _displayTimeout;
    private _events;
    private _mouseControl;
    constructor();
    initialize(options: VelocityLayerOptions): void;
    onAdd(map: L.Map): this;
    onRemove(): this;
    setData(data: GfsDataset): void;
    onDrawLayer(): void;
    _startWindy(): void;
    _initWindy(): void;
    _toggleEvents(bind?: boolean): void;
    _initMouseHandler(voidPrevious: boolean): void;
    _clearAndRestart(): void;
    _clearWind(): void;
    _destroyWind(): void;
}
