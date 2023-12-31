import { AngleConvention } from "../models/angle-convention.model";
import { VelocityUnit } from "../models/velocity-unit.model";
export declare function vectorToSpeed(uMs: number, vMs: number, unit: VelocityUnit): any;
export declare function vectorToDegrees(uMs: number, vMs: number, angleConvention: AngleConvention): number;
export declare function degreesToCardinalDirection(deg: number): string;
export declare function meterSec2Knots(meters: number): number;
export declare function meterSec2kilometerHour(meters: number): number;
export declare function meterSec2milesHour(meters: number): number;
