import * as L from 'leaflet';


export default class CanvasLayer extends L.Layer implements DelegateLayer {
	public canvas: HTMLCanvasElement;
	private _map: L.Map;
	private _frame: number;
	private _delegate: DelegateLayer = this;

	delegate (delegate: DelegateLayer): CanvasLayer {
		this._delegate = delegate;
		return this;
	}

	needRedraw () {
		if (!this._frame) {
			this._frame = L.Util.requestAnimFrame(this.drawLayer, this);
		}
		return this;
	}

	_onLayerDidResize (resizeEvent: L.ResizeEvent) {
		this.canvas.width = resizeEvent.newSize.x;
		this.canvas.height = resizeEvent.newSize.y;
	}
	
	_onLayerDidMove () {
		var topLeft = this._map.containerPointToLayerPoint([0, 0]);
		L.DomUtil.setPosition(this.canvas, topLeft);
		this.canvas.getContext("2d").clearRect(0, 0, 3000, 3000)
		this.drawLayer();
	}
	
	getEvents () {
		var events: Record<string, (event: any) => void> = {
			resize: this._onLayerDidResize,
			moveend: this._onLayerDidMove,
			zoomanim: undefined
		};

		if (this._map.options.zoomAnimation && L.Browser.any3d) {
			events.zoomanim =  this._animateZoom;
		}

		return events;
	}
	
	onAdd (map: L.Map) {
		this._map = map;
		this.canvas = L.DomUtil.create('canvas', 'leaflet-layer') as HTMLCanvasElement;

		var size = this._map.getSize();
		this.canvas.width = size.x;
		this.canvas.height = size.y;

		var animated = this._map.options.zoomAnimation && L.Browser.any3d;
		L.DomUtil.addClass(this.canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

		map.getPane('overlayPane').appendChild(this.canvas);

		this._delegate.onLayerDidMount && this._delegate.onLayerDidMount(); // -- callback
		this.needRedraw();

		this._onLayerDidMove();

		return this
	}

	onRemove (map: L.Map) {
		this._delegate.onLayerWillUnmount && this._delegate.onLayerWillUnmount(); // -- callback

		map.getPanes().overlayPane.removeChild(this.canvas);

		this.canvas = null;

		return this
	}

	addTo (map: L.Map) {
		map.addLayer(this);
		return this;
	}
	
	LatLonToMercator (latlon: L.LatLng) {
		return {
			x: latlon.lng * 6378137 * Math.PI / 180,
			y: Math.log(Math.tan((90 + latlon.lat) * Math.PI / 360)) * 6378137
		};
	}

	drawLayer () {
		// -- todo make the viewInfo properties  flat objects.
		var size   = this._map.getSize();
		var bounds = this._map.getBounds();
		var zoom   = this._map.getZoom();

		var center = this.LatLonToMercator(this._map.getCenter());
		var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));

		this._delegate.onDrawLayer && this._delegate.onDrawLayer( {
			layer : this,
			canvas: this.canvas,
			bounds: bounds,
			size: size,
			zoom: zoom,
			center : center,
			corner : corner
		});
		this._frame = null;
	}

	_animateZoom (e: L.ZoomAnimEvent) {
		const scale = this._map.getZoomScale(e.zoom, this._map.getZoom());
		const position = L.DomUtil.getPosition(this.canvas)
		const viewHalf = this._map.getSize().multiplyBy(0.5)
		const currentCenterPoint = this._map.project(this._map.getCenter(), e.zoom)
		const destCenterPoint = this._map.project(e.center, e.zoom)
		const centerOffset = destCenterPoint.subtract(currentCenterPoint)
		const topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset)
		L.DomUtil.setTransform(this.canvas, topLeftOffset, scale);
	}

	onLayerDidMount() {
		//noop
	}
	onLayerDidUnmount() {
		//noop
	}
	onLayerWillUnmount() {
		//noop
	}
	onDrawLayer() {
		//noop
	}
}

export interface DelegateLayer {
	onLayerDidMount?: () => void,
	onLayerDidUnmount?: () => void,
	onLayerWillUnmount?: () => void,
	onDrawLayer?: (data: {
			layer : CanvasLayer,
			canvas: HTMLCanvasElement,
			bounds: L.LatLngBounds,
			size: L.Point,
			zoom: number,
			center : { x: number, y: number },
			corner : { x: number, y: number }
	}) => void
}
