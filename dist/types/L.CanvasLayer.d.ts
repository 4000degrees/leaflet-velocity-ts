import * as L from "leaflet";
export default class CanvasLayer extends L.Layer implements DelegateLayer {
    canvas: HTMLCanvasElement;
    _map: L.Map;
    private _frame;
    private _delegate;
    delegate(delegate: DelegateLayer): CanvasLayer;
    needRedraw(): this;
    _onLayerDidResize(resizeEvent: L.ResizeEvent): void;
    _onLayerDidMove(): void;
    getEvents(): Record<string, (event: unknown) => void>;
    onAdd(map: L.Map): this;
    onRemove(map: L.Map): this;
    addTo(map: L.Map): this;
    LatLonToMercator(latlon: L.LatLng): {
        x: number;
        y: number;
    };
    drawLayer(): void;
    _animateZoom(e: L.ZoomAnimEvent): void;
    onLayerDidMount(): void;
    onLayerDidUnmount(): void;
    onLayerWillUnmount(): void;
    onDrawLayer(): void;
}
export interface DelegateLayer {
    onLayerDidMount?: () => void;
    onLayerDidUnmount?: () => void;
    onLayerWillUnmount?: () => void;
    onDrawLayer?: (data: {
        layer: CanvasLayer;
        canvas: HTMLCanvasElement;
        bounds: L.LatLngBounds;
        size: L.Point;
        zoom: number;
        center: {
            x: number;
            y: number;
        };
        corner: {
            x: number;
            y: number;
        };
    }) => void;
}
