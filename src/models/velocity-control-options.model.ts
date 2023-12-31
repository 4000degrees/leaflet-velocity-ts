import VelocityLayer from "../L.VelocityLayer";
import { AngleConvention } from "./angle-convention.model";
import { VelocityUnit } from "./velocity-unit.model";

export interface VelocityControlOptions {
  position: "topleft" | "topright" | "bottomleft" | "bottomright";
  emptyString: string;
  angleConvention: AngleConvention;
  showCardinal: boolean;
  speedUnit: VelocityUnit;
  directionString: string;
  speedString: string;
  velocityType: string;
  leafletVelocity?: VelocityLayer;
  onAdd?: () => void;
  onRemove?: () => void;
}
