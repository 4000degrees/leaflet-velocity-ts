import CanvasBound from "./canvasBound";
import MapBound from "./mapBound";
import Windy from "./windy";
import CanvasLayer from "./L.CanvasLayer";
import VelocityLayer from "./L.VelocityLayer";
import VelocityControl from './L.Control.Velocity'
import { VelocityControlOptions } from './L.Control.Velocity'

(<any>window).CanvasBound = CanvasBound;
(<any>window).MapBound = MapBound;
(<any>window).Windy = Windy;

const L = (<any>window).L;

L.CanvasLayer = (L.Layer ? L.Layer : L.Class).extend(new CanvasLayer());
L.canvasLayer = function () {
	return new L.CanvasLayer();
};

L.VelocityLayer = (L.Layer ? L.Layer : L.Class).extend(new VelocityLayer());

export const velocityLayer = function (options: any) {
  return new L.VelocityLayer(options);
};

L.velocityLayer = velocityLayer

