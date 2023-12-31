import * as L from "leaflet";
import CanvasLayer from "./L.CanvasLayer";
import VelocityControl, { extendedLControl } from "./L.Control.Velocity";
import CanvasBound from "./canvasBound";
import Layer from "./layer";
import MapBound from "./mapBound";
import { GfsDataset } from "./models/gfs-dataset.model";
import Windy from "./windy";
import { VelocityLayerOptions } from "./models/velocity-layer-options.model";

const L_CanvasLayer = (L.Layer ? L.Layer : L.Class).extend(new CanvasLayer());
const L_canvasLayer = function () {
  return new L_CanvasLayer();
};

export default class VelocityLayer extends L.Layer {
  public options: VelocityLayerOptions;
  public windy: Windy;
  public _map: L.Map = null;
  private _canvasLayer: CanvasLayer = null;
  private _context: CanvasRenderingContext2D = null;
  private _events: Record<string, L.LeafletEventHandlerFn> = null;
  private _mouseControl: VelocityControl;

  constructor() {
    super();
    this.options = {
      displayValues: false,
      displayOptions: {
        velocityType: "Wind",
        position: "topright",
        emptyString: "--",
        angleConvention: "bearingCCW",
        showCardinal: true,
        speedUnit: "m/s",
        directionString: "Direction",
        speedString: "Speed",
      },
      maxVelocity: 10, // used to align color scale
      colorScale: null,
      data: null,
    };
  }

  initialize(options: VelocityLayerOptions) {
    L.Util.setOptions(this, options);
  }

  onAdd(map: L.Map) {
    // create canvas, add overlay control
    this._canvasLayer = L_canvasLayer().delegate(this);
    this._canvasLayer.addTo(map);
    this._map = map;
    return this;
  }

  onRemove() {
    this._destroyWind();
    return this;
  }

  setData(data: GfsDataset) {
    this.options.data = data;

    if (this.windy) {
      this.windy.setData(data);
    }

    this.fire("load");
  }

  onDrawLayer() {
    if (!this.windy) {
      this._initWindy();
      return;
    }

    if (!this.options.data) {
      return;
    }

    this._startWindy();
  }

  _startWindy() {
    const bounds = this._map.getBounds();
    const size = this._map.getSize();

    // bounds, width, height, extent
    this.windy.start(
      new Layer(
        new MapBound(
          bounds.getNorthEast().lat,
          bounds.getNorthEast().lng,
          bounds.getSouthWest().lat,
          bounds.getSouthWest().lng
        ),
        new CanvasBound(0, 0, size.x, size.y)
      )
    );
  }

  _initWindy() {
    // windy object, copy options
    this.windy = new Windy({
      canvas: this._canvasLayer.canvas,
      ...this.options,
    });

    // prepare context global var, start drawing
    this._context = this._canvasLayer.canvas.getContext("2d");
    this._canvasLayer.canvas.classList.add("velocity-overlay");
    this.onDrawLayer();

    this._initMouseHandler(false);

    this._toggleEvents(true);
  }

  _toggleEvents(bind = true) {
    if (this._events === null) {
      this._events = {
        dragstart: () => {
          this.windy.stop();
        },
        zoomstart: () => {
          this.windy.stop();
        },
        resize: () => {
          this._clearWind();
        },
      };
    }
    for (const e in this._events) {
      if (Object.prototype.hasOwnProperty.call(this._events, e)) {
        this._map[bind ? "on" : "off"](e, this._events[e]);
      }
    }
  }

  _initMouseHandler(voidPrevious: boolean) {
    if (voidPrevious) {
      this._map.removeControl(this._mouseControl);
      this._mouseControl = null;
    }
    if (!this._mouseControl && this.options.displayValues) {
      const options = { ...this.options.displayOptions, leafletVelocity: this };
      this._mouseControl = extendedLControl.velocity(options).addTo(this._map);
    }
  }

  _clearAndRestart() {
    if (this._context) this._context.clearRect(0, 0, 3000, 3000);
    if (this.windy) this._startWindy();
  }

  _clearWind() {
    if (this.windy) this.windy.stop();
    if (this._context) this._context.clearRect(0, 0, 3000, 3000);
  }

  _destroyWind() {
    if (this.windy) this.windy.stop();
    if (this._context) this._context.clearRect(0, 0, 3000, 3000);
    this._toggleEvents(false);
    this.windy = null;
    if (this._mouseControl) this._map.removeControl(this._mouseControl);
    this._mouseControl = null;
    this._map.removeLayer(this._canvasLayer);
  }
}
