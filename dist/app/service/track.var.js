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
            args[_i - 0] = arguments[_i];
        }
        _super.apply(this, args);
        this.push.apply(this, args);
    }
    Object.defineProperty(Point.prototype, "lng", {
        get: function () {
            return this[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "lat", {
        get: function () {
            return this[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "azimuth", {
        get: function () {
            return this[2];
        },
        set: function (val) {
            this[2] = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point.prototype, "bearing", {
        get: function () {
            return this[2];
        },
        set: function (val) {
            this[2] = val;
        },
        enumerable: true,
        configurable: true
    });
    return Point;
}(Array));
exports.Point = Point;
//# sourceMappingURL=track.var.js.map