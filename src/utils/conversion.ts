import { AngleConvention } from "../models/angle-convention.model";
import { VelocityUnit } from "../models/velocity-unit.model";

export function vectorToSpeed(uMs: number, vMs: number, unit: VelocityUnit) {
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

export function vectorToDegrees(
  uMs: number,
  vMs: number,
  angleConvention: AngleConvention
) {
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

export function degreesToCardinalDirection(deg: number) {
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

export function meterSec2Knots(meters: number) {
  return meters / 0.514;
}

export function meterSec2kilometerHour(meters: number) {
  return meters * 3.6;
}

export function meterSec2milesHour(meters: number) {
  return meters * 2.23694;
}
