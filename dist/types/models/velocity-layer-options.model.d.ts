import { LayerOptions } from "leaflet";
import { WindyOptions } from "../windy";
import { GfsDataset } from "./gfs-dataset.model";
import { VelocityControlOptions } from "./velocity-control-options.model";
export interface VelocityLayerOptions extends LayerOptions, Partial<WindyOptions> {
    data: GfsDataset;
    displayValues?: boolean;
    displayOptions?: VelocityControlOptions;
    onAdd?: () => void;
    onRemove?: () => void;
}
