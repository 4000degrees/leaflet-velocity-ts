import CanvasLayer from "./L.CanvasLayer";
import VelocityLayer, { VelocityLayerOptions } from "./L.VelocityLayer";

const L = (<any>window).L;

L.CanvasLayer = (L.Layer ? L.Layer : L.Class).extend(new CanvasLayer());
L.canvasLayer = function () {
  return new L.CanvasLayer();
};

L.VelocityLayer = (L.Layer ? L.Layer : L.Class).extend(new VelocityLayer());

export const velocityLayer = (options: VelocityLayerOptions): VelocityLayer => {
  return new L.VelocityLayer(options);
};

L.velocityLayer = velocityLayer;
