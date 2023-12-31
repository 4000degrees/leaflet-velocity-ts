import * as L from "leaflet";
import { VelocityControlOptions } from "../models/velocity-control-options.model";
import {
  degreesToCardinalDirection,
  vectorToDegrees,
  vectorToSpeed,
} from "./conversion";

export function getWindSpeedString(
  map: L.Map,
  options: VelocityControlOptions,
  e: L.LeafletMouseEvent
): string {
  const pos = map.containerPointToLatLng(
    L.point(e.containerPoint.x, e.containerPoint.y)
  );
  const gridValue = options.leafletVelocity.windy.grid.get(pos.lng, pos.lat);
  let htmlOut = "";

  if (gridValue && !isNaN(gridValue.u) && !isNaN(gridValue.v)) {
    const deg = vectorToDegrees(
      gridValue.u,
      gridValue.v,
      options.angleConvention
    );
    const cardinal = options.showCardinal
      ? ` (${degreesToCardinalDirection(deg)}) `
      : "";

    htmlOut = `<strong> ${options.velocityType} ${
      options.directionString
    }: </strong> ${deg.toFixed(2)}°${cardinal}, <strong> ${
      options.velocityType
    } ${options.speedString}: </strong> ${vectorToSpeed(
      gridValue.u,
      gridValue.v,
      options.speedUnit
    ).toFixed(2)} ${options.speedUnit}`;
  } else {
    htmlOut = options.emptyString;
  }
  return htmlOut;
}
