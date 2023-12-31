'use strict';

var L$1 = require('leaflet');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var L__namespace = /*#__PURE__*/_interopNamespaceDefault(L$1);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var CanvasLayer = /** @class */ (function (_super) {
    __extends(CanvasLayer, _super);
    function CanvasLayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._delegate = _this;
        return _this;
    }
    CanvasLayer.prototype.delegate = function (delegate) {
        this._delegate = delegate;
        return this;
    };
    CanvasLayer.prototype.needRedraw = function () {
        if (!this._frame) {
            this._frame = L__namespace.Util.requestAnimFrame(this.drawLayer, this);
        }
        return this;
    };
    CanvasLayer.prototype._onLayerDidResize = function (resizeEvent) {
        this.canvas.width = resizeEvent.newSize.x;
        this.canvas.height = resizeEvent.newSize.y;
    };
    CanvasLayer.prototype._onLayerDidMove = function () {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L__namespace.DomUtil.setPosition(this.canvas, topLeft);
        this.canvas.getContext("2d").clearRect(0, 0, 3000, 3000);
        this.drawLayer();
    };
    CanvasLayer.prototype.getEvents = function () {
        var events = {
            resize: this._onLayerDidResize,
            moveend: this._onLayerDidMove,
            zoomanim: undefined,
        };
        if (this._map.options.zoomAnimation && L__namespace.Browser.any3d) {
            events.zoomanim = this._animateZoom;
        }
        return events;
    };
    CanvasLayer.prototype.onAdd = function (map) {
        this._map = map;
        this.canvas = L__namespace.DomUtil.create("canvas", "leaflet-layer");
        var size = this._map.getSize();
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        var animated = this._map.options.zoomAnimation && L__namespace.Browser.any3d;
        L__namespace.DomUtil.addClass(this.canvas, "leaflet-zoom-" + (animated ? "animated" : "hide"));
        map.getPane("overlayPane").appendChild(this.canvas);
        this._delegate.onLayerDidMount && this._delegate.onLayerDidMount(); // -- callback
        this.needRedraw();
        this._onLayerDidMove();
        return this;
    };
    CanvasLayer.prototype.onRemove = function (map) {
        this._delegate.onLayerWillUnmount && this._delegate.onLayerWillUnmount(); // -- callback
        map.getPanes().overlayPane.removeChild(this.canvas);
        this.canvas = null;
        return this;
    };
    CanvasLayer.prototype.addTo = function (map) {
        map.addLayer(this);
        return this;
    };
    CanvasLayer.prototype.LatLonToMercator = function (latlon) {
        return {
            x: (latlon.lng * 6378137 * Math.PI) / 180,
            y: Math.log(Math.tan(((90 + latlon.lat) * Math.PI) / 360)) * 6378137,
        };
    };
    CanvasLayer.prototype.drawLayer = function () {
        // -- todo make the viewInfo properties  flat objects.
        var size = this._map.getSize();
        var bounds = this._map.getBounds();
        var zoom = this._map.getZoom();
        var center = this.LatLonToMercator(this._map.getCenter());
        var corner = this.LatLonToMercator(this._map.containerPointToLatLng(this._map.getSize()));
        this._delegate.onDrawLayer &&
            this._delegate.onDrawLayer({
                layer: this,
                canvas: this.canvas,
                bounds: bounds,
                size: size,
                zoom: zoom,
                center: center,
                corner: corner,
            });
        this._frame = null;
    };
    CanvasLayer.prototype._animateZoom = function (e) {
        var scale = this._map.getZoomScale(e.zoom, this._map.getZoom());
        var position = L__namespace.DomUtil.getPosition(this.canvas);
        var viewHalf = this._map.getSize().multiplyBy(0.5);
        var currentCenterPoint = this._map.project(this._map.getCenter(), e.zoom);
        var destCenterPoint = this._map.project(e.center, e.zoom);
        var centerOffset = destCenterPoint.subtract(currentCenterPoint);
        var topLeftOffset = viewHalf
            .multiplyBy(-scale)
            .add(position)
            .add(viewHalf)
            .subtract(centerOffset);
        L__namespace.DomUtil.setTransform(this.canvas, topLeftOffset, scale);
    };
    CanvasLayer.prototype.onLayerDidMount = function () {
        //noop
    };
    CanvasLayer.prototype.onLayerDidUnmount = function () {
        //noop
    };
    CanvasLayer.prototype.onLayerWillUnmount = function () {
        //noop
    };
    CanvasLayer.prototype.onDrawLayer = function () {
        //noop
    };
    return CanvasLayer;
}(L__namespace.Layer));

function vectorToSpeed(uMs, vMs, unit) {
    var velocityAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
    // Default is m/s
    if (unit === "k/h") {
        return this.meterSec2kilometerHour(velocityAbs);
    }
    else if (unit === "kt") {
        return this.meterSec2Knots(velocityAbs);
    }
    else if (unit === "mph") {
        return this.meterSec2milesHour(velocityAbs);
    }
    else {
        return velocityAbs;
    }
}
function vectorToDegrees(uMs, vMs, angleConvention) {
    // Default angle convention is CW
    if (angleConvention.endsWith("CCW")) {
        // vMs comes out upside-down..
        vMs = vMs > 0 ? (vMs = -vMs) : Math.abs(vMs);
    }
    var velocityAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
    var velocityDir = Math.atan2(uMs / velocityAbs, vMs / velocityAbs);
    var velocityDirToDegrees = (velocityDir * 180) / Math.PI + 180;
    if (angleConvention === "bearingCW" || angleConvention === "meteoCCW") {
        velocityDirToDegrees += 180;
        if (velocityDirToDegrees >= 360)
            velocityDirToDegrees -= 360;
    }
    return velocityDirToDegrees;
}
function degreesToCardinalDirection(deg) {
    var cardinalDirection = "";
    if ((deg >= 0 && deg < 11.25) || deg >= 348.75) {
        cardinalDirection = "N";
    }
    else if (deg >= 11.25 && deg < 33.75) {
        cardinalDirection = "NNW";
    }
    else if (deg >= 33.75 && deg < 56.25) {
        cardinalDirection = "NW";
    }
    else if (deg >= 56.25 && deg < 78.75) {
        cardinalDirection = "WNW";
    }
    else if (deg >= 78.25 && deg < 101.25) {
        cardinalDirection = "W";
    }
    else if (deg >= 101.25 && deg < 123.75) {
        cardinalDirection = "WSW";
    }
    else if (deg >= 123.75 && deg < 146.25) {
        cardinalDirection = "SW";
    }
    else if (deg >= 146.25 && deg < 168.75) {
        cardinalDirection = "SSW";
    }
    else if (deg >= 168.75 && deg < 191.25) {
        cardinalDirection = "S";
    }
    else if (deg >= 191.25 && deg < 213.75) {
        cardinalDirection = "SSE";
    }
    else if (deg >= 213.75 && deg < 236.25) {
        cardinalDirection = "SE";
    }
    else if (deg >= 236.25 && deg < 258.75) {
        cardinalDirection = "ESE";
    }
    else if (deg >= 258.75 && deg < 281.25) {
        cardinalDirection = "E";
    }
    else if (deg >= 281.25 && deg < 303.75) {
        cardinalDirection = "ENE";
    }
    else if (deg >= 303.75 && deg < 326.25) {
        cardinalDirection = "NE";
    }
    else if (deg >= 326.25 && deg < 348.75) {
        cardinalDirection = "NNE";
    }
    return cardinalDirection;
}
function meterSec2Knots(meters) {
    return meters / 0.514;
}
function meterSec2kilometerHour(meters) {
    return meters * 3.6;
}
function meterSec2milesHour(meters) {
    return meters * 2.23694;
}

function getWindSpeedString(map, options, e) {
    var pos = map.containerPointToLatLng(L__namespace.point(e.containerPoint.x, e.containerPoint.y));
    var gridValue = options.leafletVelocity.windy.grid.get(pos.lng, pos.lat);
    var htmlOut = "";
    if (gridValue && !isNaN(gridValue.u) && !isNaN(gridValue.v)) {
        var deg = vectorToDegrees(gridValue.u, gridValue.v, options.angleConvention);
        var cardinal = options.showCardinal
            ? " (".concat(degreesToCardinalDirection(deg), ") ")
            : "";
        htmlOut = "<strong> ".concat(options.velocityType, " ").concat(options.directionString, ": </strong> ").concat(deg.toFixed(2), "\u00B0").concat(cardinal, ", <strong> ").concat(options.velocityType, " ").concat(options.speedString, ": </strong> ").concat(vectorToSpeed(gridValue.u, gridValue.v, options.speedUnit).toFixed(2), " ").concat(options.speedUnit);
    }
    else {
        htmlOut = options.emptyString;
    }
    return htmlOut;
}

var VelocityControl = /** @class */ (function (_super) {
    __extends(VelocityControl, _super);
    function VelocityControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = {
            position: "bottomleft",
            emptyString: "Unavailable",
            // Could be any combination of 'bearing' (angle toward which the flow goes) or 'meteo' (angle from which the flow comes)
            // and 'CW' (angle value increases clock-wise) or 'CCW' (angle value increases counter clock-wise)
            angleConvention: "bearingCCW",
            showCardinal: false,
            // Could be 'm/s' for meter per second, 'k/h' for kilometer per hour, 'mph' for miles per hour or 'kt' for knots
            speedUnit: "m/s",
            directionString: "Direction",
            speedString: "Speed",
            velocityType: "",
            onAdd: undefined,
            onRemove: undefined,
            leafletVelocity: undefined,
        };
        return _this;
    }
    VelocityControl.prototype.onAdd = function (map) {
        this._map = map;
        this._container = L__namespace.DomUtil.create("div", "leaflet-control-velocity");
        L__namespace.DomEvent.disableClickPropagation(this._container);
        map.on("mousemove", this._onMouseMove, this);
        this._container.innerHTML = this.options.emptyString;
        if (this.options.leafletVelocity.options.onAdd) {
            this.options.leafletVelocity.options.onAdd();
        }
        return this._container;
    };
    VelocityControl.prototype.onRemove = function (map) {
        var _a, _b;
        map.off("mousemove", this._onMouseMove, this);
        if ((_a = this.options.leafletVelocity) === null || _a === void 0 ? void 0 : _a.options.onRemove)
            (_b = this.options.leafletVelocity) === null || _b === void 0 ? void 0 : _b.options.onRemove();
    };
    VelocityControl.prototype._onMouseMove = function (e) {
        this._container.innerHTML = getWindSpeedString(this._map, this.options, e);
    };
    return VelocityControl;
}(L__namespace.Control));
var ExtendedLControl = Object.assign(L__namespace.Control, {
    Velocity: L__namespace.Control.extend(new VelocityControl()),
});
var extendedLControl = Object.assign(L__namespace.control, {
    velocity: function (options) {
        return new ExtendedLControl.Velocity(options);
    },
});

var Particle = /** @class */ (function () {
    function Particle(x, y, maxAge) {
        this.x = x;
        this.y = y;
        this.age = Math.floor(Math.random() * maxAge);
        this.maxAge = maxAge;
    }
    Particle.prototype.reset = function (x, y) {
        this.x = x;
        this.y = y;
        this.age = 0;
    };
    Object.defineProperty(Particle.prototype, "isDead", {
        get: function () {
            return this.age > this.maxAge;
        },
        enumerable: false,
        configurable: true
    });
    Particle.prototype.grow = function () {
        this.age++;
    };
    return Particle;
}());

var CanvasBound = /** @class */ (function () {
    function CanvasBound(xMin, yMin, xMax, yMax) {
        this.xMin = xMin;
        this.yMin = yMin;
        this.xMax = xMax;
        this.yMax = yMax;
    }
    Object.defineProperty(CanvasBound.prototype, "width", {
        get: function () {
            return this.xMax - this.xMin;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CanvasBound.prototype, "height", {
        get: function () {
            return this.yMax - this.yMin;
        },
        enumerable: false,
        configurable: true
    });
    CanvasBound.prototype.getRandomParticle = function (maxAge) {
        var x = Math.round(Math.floor(Math.random() * this.width) + this.xMin);
        var y = Math.round(Math.floor(Math.random() * this.height) + this.yMin);
        return new Particle(x, y, maxAge);
    };
    CanvasBound.prototype.resetParticle = function (p) {
        var x = Math.round(Math.floor(Math.random() * this.width) + this.xMin);
        var y = Math.round(Math.floor(Math.random() * this.height) + this.yMin);
        p.reset(x, y);
        return p;
    };
    return CanvasBound;
}());

var layer = /** @class */ (function () {
    function layer(mapBound, canvasBound) {
        this.canvasBound = canvasBound;
        this.mapBound = mapBound;
    }
    /**
     * Find geocoordinate from canvas point
     * @param x
     * @param y
     * return [lng, lat]
     */
    layer.prototype.canvasToMap = function (x, y) {
        var mapLonDelta = this.mapBound.east - this.mapBound.west;
        var worldMapRadius = ((this.canvasBound.width / this.rad2deg(mapLonDelta)) * 360) /
            (2 * Math.PI);
        var mapOffsetY = (worldMapRadius / 2) *
            Math.log((1 + Math.sin(this.mapBound.south)) /
                (1 - Math.sin(this.mapBound.south)));
        var equatorY = this.canvasBound.height + mapOffsetY;
        var a = (equatorY - y) / worldMapRadius;
        var φ = (180 / Math.PI) * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
        var λ = this.rad2deg(this.mapBound.west) +
            (x / this.canvasBound.width) * this.rad2deg(mapLonDelta);
        return [λ, φ];
    };
    layer.prototype.mercY = function (φ) {
        return Math.log(Math.tan(φ / 2 + Math.PI / 4));
    };
    /**
     * Project a point on the map
     * @param λ Longitude
     * @param φ Latitude
     * @return [x, y]
     */
    layer.prototype.mapToCanvas = function (λ, φ) {
        var ymin = this.mercY(this.mapBound.south);
        var ymax = this.mercY(this.mapBound.north);
        var xFactor = this.canvasBound.width / (this.mapBound.east - this.mapBound.west);
        var yFactor = this.canvasBound.height / (ymax - ymin);
        var y = this.mercY(this.deg2rad(φ));
        var x = (this.deg2rad(λ) - this.mapBound.west) * xFactor;
        y = (ymax - y) * yFactor;
        return [x, y];
    };
    layer.prototype.deg2rad = function (deg) {
        return (deg * Math.PI) / 180;
    };
    layer.prototype.rad2deg = function (rad) {
        return (rad * 180) / Math.PI;
    };
    /**
     *
     * @param λ Longitude
     * @param φ Latitude
     * @param x
     * @param y
     * @return []
     */
    layer.prototype.distortion = function (λ, φ, x, y) {
        var τ = 2 * Math.PI;
        //@see https://github.com/danwild/leaflet-velocity/issues/15#issuecomment-345260768
        var H = 5;
        var hλ = λ < 0 ? H : -H;
        var hφ = φ < 0 ? H : -H;
        var pλ = this.mapToCanvas(λ + hλ, φ);
        var pφ = this.mapToCanvas(λ, φ + hφ);
        // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1º λ
        // changes depending on φ. Without this, there is a pinching effect at the poles.
        var k = Math.cos((φ / 360) * τ);
        return [
            (pλ[0] - x) / hλ / k,
            (pλ[1] - y) / hλ / k,
            (pφ[0] - x) / hφ,
            (pφ[1] - y) / hφ,
        ];
    };
    /**
     * Calculate distortion of the wind vector caused by the shape of the projection at point (x, y). The wind
     * vector is modified in place and returned by this function.
     * @param λ
     * @param φ
     * @param x
     * @param y
     * @param scale scale factor
     * @param wind [u, v]
     * @return []
     */
    layer.prototype.distort = function (λ, φ, x, y, scale, wind) {
        var u = wind.u * scale;
        var v = wind.v * scale;
        var d = this.distortion(λ, φ, x, y);
        // Scale distortion vectors by u and v, then add.
        wind.u = d[0] * u + d[2] * v;
        wind.v = d[1] * u + d[3] * v;
        return wind;
    };
    return layer;
}());

var MapBound = /** @class */ (function () {
    function MapBound(north, east, south, west) {
        this.north = (north * Math.PI) / 180;
        this.east = (east * Math.PI) / 180;
        this.south = (south * Math.PI) / 180;
        this.west = (west * Math.PI) / 180;
    }
    Object.defineProperty(MapBound.prototype, "width", {
        get: function () {
            return (720 + this.east - this.west) % 360;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapBound.prototype, "height", {
        get: function () {
            return (360 + this.north - this.south) % 180;
        },
        enumerable: false,
        configurable: true
    });
    return MapBound;
}());

var Vector = /** @class */ (function () {
    function Vector(u, v) {
        this.u = u || 0;
        this.v = v || 0;
    }
    Object.defineProperty(Vector.prototype, "intensity", {
        get: function () {
            return Math.sqrt(this.u * this.u + this.v * this.v);
        },
        enumerable: false,
        configurable: true
    });
    return Vector;
}());

var Grid = /** @class */ (function () {
    function Grid(data, φ0, λ0, Δφ, Δλ, height, width) {
        this.data = data;
        this.φ0 = φ0;
        this.λ0 = λ0;
        this.Δλ = Δλ;
        this.Δφ = Δφ;
        this.height = height;
        this.width = width;
    }
    Object.defineProperty(Grid.prototype, "valueRange", {
        get: function () {
            if (!this.data.length) {
                return [0, 0];
            }
            var min = this.data[0].intensity;
            var max = this.data[0].intensity;
            this.data.forEach(function (value) {
                min = Math.min(min, value.intensity);
                max = Math.max(max, value.intensity);
            });
            return [min, max];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get vector at any point
     * @param λ Longitude
     * @param φ Latitude
     */
    Grid.prototype.get = function (λ, φ) {
        var fλ = this.floorMod(λ - this.λ0, 360) / this.Δλ; // calculate longitude index in wrapped range [0, 360)
        var fφ = (this.φ0 - φ) / this.Δφ; // calculate latitude index in direction +90 to -90
        var iλ = Math.floor(fλ); // col n
        var jλ = iλ + 1; // col n+1
        if (jλ >= this.width) {
            jλ = this.λ0;
        }
        var iφ = Math.floor(fφ); // line m
        var jφ = iφ + 1; // line m+1
        if (jφ >= this.height) {
            jφ = iφ;
        }
        var vλ = fλ - iλ; // col variation [0..1]
        var vφ = fφ - iφ; // line variation [0..1]
        if (iλ >= 0 && iφ >= 0 && iλ < this.width && iφ < this.height) {
            return this.interpolation(vλ, vφ, this.data[iλ + iφ * this.width], //l0c0
            this.data[jλ + iφ * this.width], //l0c1
            this.data[iλ + jφ * this.width], //l1c0
            this.data[jλ + jφ * this.width] //l1cl
            );
        }
        return new Vector(0, 0);
    };
    /**
     * Interpolate value
     * @param x variation between g0* and g1*
     * @param y variation between g*0 dans g*1
     * @param g00 point at col_0 and line_0
     * @param g10 point at col_1 and line_0
     * @param g01 point at col_0 and line_1
     * @param g11 point at col_1 and line_1
     * @return interpolated vector
     */
    Grid.prototype.interpolation = function (x, y, g00, g10, g01, g11) {
        var rx = 1 - x;
        var ry = 1 - y;
        var a = rx * ry;
        var b = x * ry;
        var c = rx * y;
        var d = x * y;
        var u = g00.u * a + g10.u * b + g01.u * c + g11.u * d;
        var v = g00.v * a + g10.v * b + g01.v * c + g11.v * d;
        return new Vector(u, v);
    };
    /**
     * Custom modulo
     * @returns {number} returns remainder of floored division, i.e., floor(a / n). Useful for consistent modulo
     *          of negative numbers. See http://en.wikipedia.org/wiki/Modulo_operation.
     */
    Grid.prototype.floorMod = function (a, n) {
        return a - n * Math.floor(a / n);
    };
    /**
     * Detect if x is a value
     * @returns {boolean} true if the specified value is not null and not undefined.
     */
    Grid.prototype.isValue = function (x) {
        return x !== null && x !== undefined;
    };
    return Grid;
}());

var ColorScale = /** @class */ (function () {
    function ColorScale(minValue, maxValue, scale) {
        this.scale = [
            "rgb(36,104, 180)",
            "rgb(60,157, 194)",
            "rgb(128,205,193 )",
            "rgb(151,218,168 )",
            "rgb(198,231,181)",
            "rgb(238,247,217)",
            "rgb(255,238,159)",
            "rgb(252,217,125)",
            "rgb(255,182,100)",
            "rgb(252,150,75)",
            "rgb(250,112,52)",
            "rgb(245,64,32)",
            "rgb(237,45,28)",
            "rgb(220,24,32)",
            "rgb(180,0,35)",
        ];
        this.setMinMax(minValue, maxValue);
        if (scale instanceof Array && scale.length) {
            this.scale = scale;
        }
    }
    ColorScale.prototype.setMinMax = function (minValue, maxValue) {
        this.minValue = minValue;
        this.maxValue = maxValue;
    };
    Object.defineProperty(ColorScale.prototype, "size", {
        get: function () {
            return this.scale.length;
        },
        enumerable: false,
        configurable: true
    });
    ColorScale.prototype.getColorIndex = function (value) {
        if (value <= this.minValue) {
            return 0;
        }
        if (value >= this.maxValue) {
            return this.scale.length - 1;
        }
        var index = (this.scale.length * (value - this.minValue)) /
            (this.maxValue - this.minValue);
        if (index < 0) {
            return 0;
        }
        if (index > this.scale.length - 1) {
            return this.scale.length - 1;
        }
        return Math.floor(index);
    };
    ColorScale.prototype.colorAt = function (index) {
        return this.scale[index];
    };
    ColorScale.prototype.getColor = function (value) {
        return this.scale[this.getColorIndex(value)];
    };
    return ColorScale;
}());

var AnimationBucket = /** @class */ (function () {
    function AnimationBucket(colorScale) {
        this.buckets = [];
        this.colorScale = colorScale;
        for (var i = 0; i < colorScale.size; i++) {
            this.buckets.push([]);
        }
    }
    AnimationBucket.prototype.clear = function () {
        this.buckets.forEach(function (particleSet) {
            particleSet.splice(0, particleSet.length);
        });
    };
    AnimationBucket.prototype.add = function (p, v) {
        var index = this.colorScale.getColorIndex(p.intensity);
        if (index < 0 || index >= this.buckets.length) {
            console.log(index);
            return;
        }
        p.xt = p.x + v.u;
        p.yt = p.y + v.v;
        this.buckets[index].push(p);
    };
    AnimationBucket.prototype.draw = function (context2D) {
        var _this = this;
        this.buckets.forEach(function (bucket, i) {
            if (bucket.length > 0) {
                context2D.beginPath();
                context2D.strokeStyle = _this.colorScale.colorAt(i);
                bucket.forEach(function (particle) {
                    context2D.moveTo(particle.x, particle.y);
                    context2D.lineTo(particle.xt, particle.yt);
                    particle.x = particle.xt;
                    particle.y = particle.yt;
                });
                context2D.stroke();
            }
        });
    };
    return AnimationBucket;
}());

var Windy = /** @class */ (function () {
    function Windy(options) {
        this.canvas = null;
        this.particleMultiplier = 1 / 300;
        this.autoColorRange = false;
        this.particles = [];
        this.animationLoop = null;
        this.then = 0;
        this.canvas = options.canvas;
        if (options.minVelocity === undefined &&
            options.maxVelocity === undefined) {
            this.autoColorRange = true;
        }
        this.colorScale = new ColorScale(options.minVelocity || 0, options.maxVelocity || 10, options.colorScale);
        this.velocityScale = options.velocityScale || 0.01;
        this.particleAge = options.particleAge || 64;
        this.setData(options.data);
        this.particleMultiplier = options.particleMultiplier || 1 / 300;
        this.particleLineWidth = options.lineWidth || 1;
        var frameRate = options.frameRate || 15;
        this.frameTime = 1000 / frameRate;
    }
    Object.defineProperty(Windy.prototype, "particleCount", {
        get: function () {
            var particleReduction = /android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(navigator.userAgent)
                ? Math.pow(window.devicePixelRatio, 1 / 3) || 1.6
                : 1;
            return (Math.round(this.layer.canvasBound.width *
                this.layer.canvasBound.height *
                this.particleMultiplier) * particleReduction);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Load data
     * @param data
     */
    Windy.prototype.setData = function (data) {
        var uData = null;
        var vData = null;
        var grid = [];
        data.forEach(function (record) {
            switch ("".concat(record.header.parameterCategory, ",").concat(record.header.parameterNumber)) {
                case "1,2":
                case "2,2":
                    uData = record;
                    break;
                case "1,3":
                case "2,3":
                    vData = record;
                    break;
            }
        });
        if (!uData || !vData) {
            console.warn("Data are not correct format");
            return;
        }
        uData.data.forEach(function (u, index) {
            grid.push(new Vector(u, vData.data[index]));
        });
        this.grid = new Grid(grid, uData.header.la1, uData.header.lo1, uData.header.dy, uData.header.dx, uData.header.ny, uData.header.nx);
        if (this.autoColorRange) {
            var minMax = this.grid.valueRange;
            this.colorScale.setMinMax(minMax[0], minMax[1]);
        }
    };
    Windy.prototype.getParticleWind = function (p) {
        var lngLat = this.layer.canvasToMap(p.x, p.y);
        var wind = this.grid.get(lngLat[0], lngLat[1]);
        p.intensity = wind.intensity;
        var mapArea = this.layer.mapBound.height * this.layer.mapBound.width;
        var velocityScale = this.velocityScale * Math.pow(mapArea, 0.4);
        this.layer.distort(lngLat[0], lngLat[1], p.x, p.y, velocityScale, wind);
        return wind;
    };
    Windy.prototype.start = function (layer) {
        this.context2D = this.canvas.getContext("2d");
        this.context2D.lineWidth = this.particleLineWidth;
        this.context2D.fillStyle = "rgba(0, 0, 0, 0.97)";
        this.context2D.globalAlpha = 0.6;
        this.layer = layer;
        this.animationBucket = new AnimationBucket(this.colorScale);
        this.particles.splice(0, this.particles.length);
        for (var i = 0; i < this.particleCount; i++) {
            this.particles.push(this.layer.canvasBound.getRandomParticle(this.particleAge));
        }
        this.then = new Date().getTime();
        this.frame();
    };
    Windy.prototype.frame = function () {
        var _this = this;
        this.animationLoop = requestAnimationFrame(function () {
            _this.frame();
        });
        var now = new Date().getTime();
        var delta = now - this.then;
        if (delta > this.frameTime) {
            this.then = now - (delta % this.frameTime);
            this.evolve();
            this.draw();
        }
    };
    Windy.prototype.evolve = function () {
        var _this = this;
        this.animationBucket.clear();
        this.particles.forEach(function (p) {
            p.grow();
            if (p.isDead) {
                _this.layer.canvasBound.resetParticle(p);
            }
            var wind = _this.getParticleWind(p);
            _this.animationBucket.add(p, wind);
        });
    };
    Windy.prototype.draw = function () {
        this.context2D.globalCompositeOperation = "destination-in";
        this.context2D.fillRect(this.layer.canvasBound.xMin, this.layer.canvasBound.yMin, this.layer.canvasBound.width, this.layer.canvasBound.height);
        // Fade existing particle trails.
        this.context2D.globalCompositeOperation = "lighter";
        this.context2D.globalAlpha = 0.9;
        this.animationBucket.draw(this.context2D);
    };
    Windy.prototype.stop = function () {
        this.particles.splice(0, this.particles.length);
        this.animationBucket.clear();
        if (this.animationLoop) {
            clearTimeout(this.animationLoop);
            this.animationLoop = null;
        }
    };
    return Windy;
}());

var L_CanvasLayer = (L__namespace.Layer ? L__namespace.Layer : L__namespace.Class).extend(new CanvasLayer());
var L_canvasLayer = function () {
    return new L_CanvasLayer();
};
var VelocityLayer = /** @class */ (function (_super) {
    __extends(VelocityLayer, _super);
    function VelocityLayer() {
        var _this = _super.call(this) || this;
        _this._map = null;
        _this._canvasLayer = null;
        _this._context = null;
        _this._events = null;
        _this.options = {
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
            maxVelocity: 10,
            colorScale: null,
            data: null,
        };
        return _this;
    }
    VelocityLayer.prototype.initialize = function (options) {
        L__namespace.Util.setOptions(this, options);
    };
    VelocityLayer.prototype.onAdd = function (map) {
        // create canvas, add overlay control
        this._canvasLayer = L_canvasLayer().delegate(this);
        this._canvasLayer.addTo(map);
        this._map = map;
        return this;
    };
    VelocityLayer.prototype.onRemove = function () {
        this._destroyWind();
        return this;
    };
    VelocityLayer.prototype.setData = function (data) {
        this.options.data = data;
        if (this.windy) {
            this.windy.setData(data);
        }
        this.fire("load");
    };
    VelocityLayer.prototype.onDrawLayer = function () {
        if (!this.windy) {
            this._initWindy();
            return;
        }
        if (!this.options.data) {
            return;
        }
        this._startWindy();
    };
    VelocityLayer.prototype._startWindy = function () {
        var bounds = this._map.getBounds();
        var size = this._map.getSize();
        // bounds, width, height, extent
        this.windy.start(new layer(new MapBound(bounds.getNorthEast().lat, bounds.getNorthEast().lng, bounds.getSouthWest().lat, bounds.getSouthWest().lng), new CanvasBound(0, 0, size.x, size.y)));
    };
    VelocityLayer.prototype._initWindy = function () {
        // windy object, copy options
        this.windy = new Windy(__assign({ canvas: this._canvasLayer.canvas }, this.options));
        // prepare context global var, start drawing
        this._context = this._canvasLayer.canvas.getContext("2d");
        this._canvasLayer.canvas.classList.add("velocity-overlay");
        this.onDrawLayer();
        this._initMouseHandler(false);
        this._toggleEvents(true);
    };
    VelocityLayer.prototype._toggleEvents = function (bind) {
        var _this = this;
        if (bind === void 0) { bind = true; }
        if (this._events === null) {
            this._events = {
                dragstart: function () {
                    _this.windy.stop();
                },
                zoomstart: function () {
                    _this.windy.stop();
                },
                resize: function () {
                    _this._clearWind();
                },
            };
        }
        for (var e in this._events) {
            if (Object.prototype.hasOwnProperty.call(this._events, e)) {
                this._map[bind ? "on" : "off"](e, this._events[e]);
            }
        }
    };
    VelocityLayer.prototype._initMouseHandler = function (voidPrevious) {
        if (voidPrevious) {
            this._map.removeControl(this._mouseControl);
            this._mouseControl = null;
        }
        if (!this._mouseControl && this.options.displayValues) {
            var options = __assign(__assign({}, this.options.displayOptions), { leafletVelocity: this });
            this._mouseControl = extendedLControl.velocity(options).addTo(this._map);
        }
    };
    VelocityLayer.prototype._clearAndRestart = function () {
        if (this._context)
            this._context.clearRect(0, 0, 3000, 3000);
        if (this.windy)
            this._startWindy();
    };
    VelocityLayer.prototype._clearWind = function () {
        if (this.windy)
            this.windy.stop();
        if (this._context)
            this._context.clearRect(0, 0, 3000, 3000);
    };
    VelocityLayer.prototype._destroyWind = function () {
        if (this.windy)
            this.windy.stop();
        if (this._context)
            this._context.clearRect(0, 0, 3000, 3000);
        this._toggleEvents(false);
        this.windy = null;
        if (this._mouseControl)
            this._map.removeControl(this._mouseControl);
        this._mouseControl = null;
        this._map.removeLayer(this._canvasLayer);
    };
    return VelocityLayer;
}(L__namespace.Layer));

var L = window.L;
L.CanvasLayer = (L.Layer ? L.Layer : L.Class).extend(new CanvasLayer());
L.canvasLayer = function () {
    return new L.CanvasLayer();
};
L.VelocityLayer = (L.Layer ? L.Layer : L.Class).extend(new VelocityLayer());
var velocityLayer = function (options) {
    return new L.VelocityLayer(options);
};
L.velocityLayer = velocityLayer;

exports.ExtendedLControl = ExtendedLControl;
exports.degreesToCardinalDirection = degreesToCardinalDirection;
exports.extendedLControl = extendedLControl;
exports.getWindSpeedString = getWindSpeedString;
exports.meterSec2Knots = meterSec2Knots;
exports.meterSec2kilometerHour = meterSec2kilometerHour;
exports.meterSec2milesHour = meterSec2milesHour;
exports.vectorToDegrees = vectorToDegrees;
exports.vectorToSpeed = vectorToSpeed;
exports.velocityLayer = velocityLayer;
//# sourceMappingURL=bundle.cjs.js.map
