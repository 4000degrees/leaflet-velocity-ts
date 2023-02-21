import * as L from "leaflet";
import VelocityLayer from "./L.VelocityLayer";

export type AngleConversion =
  | "bearingCW"
  | "bearingCCW"
  | "meteoCW"
  | "meteoCCW";

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

  vectorToSpeed(uMs: number, vMs: number, unit: VelocityUnit) {
    const velocityAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
    // Default is m/s
    if (unit === "k/h") {
      return this.meterSec2kilometerHour(velocityAbs);
    } else if (unit === "kt") {
      return this.meterSec2Knots(velocityAbs);
    } else if (unit === "mph") {
      return this.meterSec2milesHour(velocityAbs);
    } else {
      return velocityAbs;
    }
  }

  vectorToDegrees(uMs: number, vMs: number, angleConvention: AngleConversion) {
    // Default angle convention is CW
    if (angleConvention.endsWith("CCW")) {
      // vMs comes out upside-down..
      vMs = vMs > 0 ? (vMs = -vMs) : Math.abs(vMs);
    }
    const velocityAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));

    const velocityDir = Math.atan2(uMs / velocityAbs, vMs / velocityAbs);
    let velocityDirToDegrees = (velocityDir * 180) / Math.PI + 180;

    if (angleConvention === "bearingCW" || angleConvention === "meteoCCW") {
      velocityDirToDegrees += 180;
      if (velocityDirToDegrees >= 360) velocityDirToDegrees -= 360;
    }

    return velocityDirToDegrees;
  }

  degreesToCardinalDirection(deg: number) {
    let cardinalDirection = "";
    if ((deg >= 0 && deg < 11.25) || deg >= 348.75) {
      cardinalDirection = "N";
    } else if (deg >= 11.25 && deg < 33.75) {
      cardinalDirection = "NNW";
    } else if (deg >= 33.75 && deg < 56.25) {
      cardinalDirection = "NW";
    } else if (deg >= 56.25 && deg < 78.75) {
      cardinalDirection = "WNW";
    } else if (deg >= 78.25 && deg < 101.25) {
      cardinalDirection = "W";
    } else if (deg >= 101.25 && deg < 123.75) {
      cardinalDirection = "WSW";
    } else if (deg >= 123.75 && deg < 146.25) {
      cardinalDirection = "SW";
    } else if (deg >= 146.25 && deg < 168.75) {
      cardinalDirection = "SSW";
    } else if (deg >= 168.75 && deg < 191.25) {
      cardinalDirection = "S";
    } else if (deg >= 191.25 && deg < 213.75) {
      cardinalDirection = "SSE";
    } else if (deg >= 213.75 && deg < 236.25) {
      cardinalDirection = "SE";
    } else if (deg >= 236.25 && deg < 258.75) {
      cardinalDirection = "ESE";
    } else if (deg >= 258.75 && deg < 281.25) {
      cardinalDirection = "E";
    } else if (deg >= 281.25 && deg < 303.75) {
      cardinalDirection = "ENE";
    } else if (deg >= 303.75 && deg < 326.25) {
      cardinalDirection = "NE";
    } else if (deg >= 326.25 && deg < 348.75) {
      cardinalDirection = "NNE";
    }

    return cardinalDirection;
  }

  meterSec2Knots(meters: number) {
    return meters / 0.514;
  }

  meterSec2kilometerHour(meters: number) {
    return meters * 3.6;
  }

  meterSec2milesHour(meters: number) {
    return meters * 2.23694;
  }

  _onMouseMove(e: L.LeafletMouseEvent) {
    const pos = this._map.containerPointToLatLng(
      L.point(e.containerPoint.x, e.containerPoint.y)
    );
    const gridValue = this.options.leafletVelocity.windy.grid.get(
      pos.lng,
      pos.lat
    );
    let htmlOut = "";

    if (gridValue && !isNaN(gridValue.u) && !isNaN(gridValue.v)) {
      const deg = this.vectorToDegrees(
        gridValue.u,
        gridValue.v,
        this.options.angleConvention
      );
      const cardinal = this.options.showCardinal
        ? ` (${this.degreesToCardinalDirection(deg)}) `
        : "";

      htmlOut = `<strong> ${this.options.velocityType} ${
        this.options.directionString
      }: </strong> ${deg.toFixed(2)}°${cardinal}, <strong> ${
        this.options.velocityType
      } ${this.options.speedString}: </strong> ${this.vectorToSpeed(
        gridValue.u,
        gridValue.v,
        this.options.speedUnit
      ).toFixed(2)} ${this.options.speedUnit}`;
    } else {
      htmlOut = this.options.emptyString;
    }

    this._container.innerHTML = htmlOut;
  }
}

export const ExtendedLControl = Object.assign(L.Control, {
  Velocity: L.Control.extend(new VelocityControl()),
});
export const extendedLControl = Object.assign(L.control, {
  velocity: (options: VelocityControlOptions) =>
    new ExtendedLControl.Velocity(options),
});
