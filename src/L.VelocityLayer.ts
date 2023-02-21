import Windy, { WindyOptions } from './windy';
import CanvasBound from './canvasBound'
import MapBound from './mapBound';
import Layer from "./layer";
import CanvasLayer from './L.CanvasLayer';
import * as L from 'leaflet';
import { extendedLControl, VelocityControlOptions } from './L.Control.Velocity'
import VelocityControl from './L.Control.Velocity'
import { GfsDataset } from './gfs-dataset.model';

const L_CanvasLayer = (L.Layer ? L.Layer : L.Class).extend(new CanvasLayer());
let L_canvasLayer = function () {
	return new L_CanvasLayer();
};

export interface VelocityLayerOptions extends Partial<WindyOptions> {
	displayValues: boolean,
	displayOptions: VelocityControlOptions,
	data: GfsDataset,
	onAdd?: Function,
    onRemove?: Function,
}

export default class VelocityLayer extends L.Layer {

    public options: VelocityLayerOptions;
	public windy: Windy;
    private _map: L.Map = null;
	private _canvasLayer: CanvasLayer = null;
	private _context: CanvasRenderingContext2D = null;
	private _displayTimeout: ReturnType<typeof setTimeout>;
	private _events: Record<string, L.LeafletEventHandlerFn> = null
	private _mouseControl: VelocityControl
    
    constructor () {
		super()
        this.options = {
            displayValues: true,
			displayOptions: {
				velocityType: 'Wind',
				position: 'topright',
				emptyString: '--',
				angleConvention: 'bearingCCW',
				showCardinal: true,
				speedUnit: 'm/s',
				directionString: 'Direction',
				speedString: 'Speed',
			},
            maxVelocity: 10, // used to align color scale
            colorScale: null,
            data: null
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
		return this
	}

	onRemove() {
		this._destroyWind();
		return this
	}

	setData(data: GfsDataset) {
		this.options.data = data;

		if (this.windy) {
			this.windy.setData(data);
			this._clearAndRestart();
		}

		this.fire('load');
	}

	/*------------------------------------ PRIVATE ------------------------------------------*/

	onDrawLayer() {
		var self = this;

		if (!this.windy) {
			this._initWindy();
			return;
		}

		if (!this.options.data) {
			return;
		}

		if (this._displayTimeout) clearTimeout(self._displayTimeout);

		this._displayTimeout = setTimeout(function () {
			self._startWindy();
		}, 150); // showing velocity is delayed
	}

	_startWindy() {
		var bounds = this._map.getBounds();
		var size = this._map.getSize();

		// bounds, width, height, extent
		this.windy.start(
			new Layer(
				new MapBound(
					bounds.getNorthEast().lat,
					bounds.getNorthEast().lng,
					bounds.getSouthWest().lat,
					bounds.getSouthWest().lng
				),
				new CanvasBound(0,0,size.x, size.y)
			)
			
		);
	}

	_initWindy() {

		// windy object, copy options
		this.windy = new Windy({ canvas: this._canvasLayer.canvas, ...this.options });

		// prepare context global var, start drawing
		this._context = this._canvasLayer.canvas.getContext('2d');
		this._canvasLayer.canvas.classList.add("velocity-overlay");
		this.onDrawLayer();

		this._initMouseHandler(false);

		this._toggleEvents(true)
	}

	_toggleEvents(bind: boolean = true){
		if(this._events === null) {
			this._events = {
				'dragstart': () => {
					this.windy.stop();
				},
				'zoomstart': () => {
					this.windy.stop();
				},
				'resize': () => {
					this._clearWind();
				}
			};
		}
		for(let e in this._events) {
			if(this._events.hasOwnProperty(e)) {
				this._map[bind ? 'on' : 'off'](e, this._events[e])
			}
		}
	}


	_initMouseHandler(voidPrevious: boolean) {
		if (voidPrevious) {
		  this._map.removeControl(this._mouseControl);
		  this._mouseControl = null;
		}
		if (!this._mouseControl && this.options.displayValues) {
		  var options = {...this.options.displayOptions, leafletVelocity: this};
		  this._mouseControl = extendedLControl.velocity(options).addTo(this._map);
		}
	  }


	_clearAndRestart(){
		if (this._context) this._context.clearRect(0, 0, 3000, 3000);
		if (this.windy) this._startWindy();
	}

	_clearWind() {
		if (this.windy) this.windy.stop();
		if (this._context) this._context.clearRect(0, 0, 3000, 3000);
	}

	_destroyWind() {
		if (this._displayTimeout) clearTimeout(this._displayTimeout);
		if (this.windy) this.windy.stop();
		if (this._context) this._context.clearRect(0, 0, 3000, 3000);
		//off event bind
		this._toggleEvents(false)
		this.windy = null;
		if (this._mouseControl) this._map.removeControl(this._mouseControl);
		this._mouseControl = null;
		this._map.removeLayer(this._canvasLayer);
	}
}