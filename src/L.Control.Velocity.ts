import * as L from "leaflet";
import { VelocityControlOptions } from "./models/velocity-control-options.model";
import { getWindSpeedString } from "./utils/get-wind-speed-string";

export default class VelocityControl extends L.Control {
  _container: HTMLElement;
  _map: L.Map;

  options: VelocityControlOptions = {
    position: "bottomleft",
    emptyString: "Unavailable",
    // Could be any combination of 'bearing' (angle toward which the flow goes) or 'meteo' (angle from which the flow comes)
    // and 'CW' (angle value increases clock-wise) or 'CCW' (angle value increases counter clock-wise)
    angleConvention: "bearingCCW",
    showCardinal: false,
    // Could be 'm/s' for meter per second, 'k/h' for kilometer per hour, 'mph' for miles per hour or 'kt' for knots
    speedUnit: "m/s",
    directionString: "Direction",
    speedString: "Speed",
    velocityType: "",
    onAdd: undefined,
    onRemove: undefined,
    leafletVelocity: undefined,
  };

  onAdd(map: L.Map) {
    this._map = map;
    this._container = L.DomUtil.create("div", "leaflet-control-velocity");
    L.DomEvent.disableClickPropagation(this._container);
    map.on("mousemove", this._onMouseMove, this);
    this._container.innerHTML = this.options.emptyString;
    if (this.options.leafletVelocity.options.onAdd) {
      this.options.leafletVelocity.options.onAdd();
    }
    return this._container;
  }

  onRemove(map: L.Map) {
    map.off("mousemove", this._onMouseMove, this);
    if (this.options.leafletVelocity?.options.onRemove)
      this.options.leafletVelocity?.options.onRemove();
  }

  _onMouseMove(e: L.LeafletMouseEvent) {
    this._container.innerHTML = getWindSpeedString(this._map, this.options, e);
  }
}

export const ExtendedLControl = Object.assign(L.Control, {
  Velocity: L.Control.extend(new VelocityControl()),
});
export const extendedLControl = Object.assign(L.control, {
  velocity: (options: VelocityControlOptions) =>
    new ExtendedLControl.Velocity(options),
});
