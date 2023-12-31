import CanvasLayer from "./L.CanvasLayer";
import VelocityLayer from "./L.VelocityLayer";
import { VelocityLayerOptions } from "./models/velocity-layer-options.model";

const L = (<any>window).L;

L.CanvasLayer = (L.Layer ? L.Layer : L.Class).extend(new CanvasLayer());
L.canvasLayer = function () {
  return new L.CanvasLayer();
};

L.VelocityLayer = (L.Layer ? L.Layer : L.Class).extend(new VelocityLayer());

export const velocityLayer = (options: VelocityLayerOptions): VelocityLayer => {
  return new L.VelocityLayer(options);
};

export * from "./L.Control.Velocity";
export * from "./utils/conversion";
export * from "./utils/get-wind-speed-string";

L.velocityLayer = velocityLayer;
