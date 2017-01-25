"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Point = (function (_super) {
    __extends(Point, _super);
    function Point() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = _super.apply(this, args) || this;
        //this.push(...args);
        _this.lng = args[0];
        _this.lat = args[1];
        _this.bearing = _this.azimuth = args[2];
        return _this;
    }
    Object.defineProperty(Point.prototype, "bearing", {
        get: function () {
            return this._bearing;
        },
        set: function (value) {
            this._bearing = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "lat", {
        get: function () {
            return this[1];
        },
        set: function (value) {
            this._lat = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "lng", {
        get: function () {
            return this._lng;
        },
        set: function (val) {
            this._lng = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "azimuth", {
        get: function () {
            return this._azimuth;
        },
        set: function (val) {
            this._azimuth = val;
        },
        enumerable: true,
        configurable: true
    });
    return Point;
}(Array));
exports.Point = Point;
//# sourceMappingURL=track.var.js.map