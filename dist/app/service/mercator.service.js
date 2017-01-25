"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by maxislav on 20.10.16.
 */
var core_1 = require("@angular/core");
var Mercator = (function () {
    function Mercator() {
        var _this = this;
        this.getYpixel = function (fi, z) {
            var pi = _this.Pi;
            var t = Math.tan((pi / 4) + _this.toRad(fi) / 2);
            _this.dy = (128 / pi) * Math.pow(2, z) * (pi - Math.log(t));
            return Math.round(_this.dy);
        };
        this.getXpixel = function (la, z) {
            var pi = _this.Pi;
            return (128 / pi) * Math.pow(2, z) * (_this.toRad(la) + pi);
        };
        this.Pi = Math.PI;
        this.getXpixel;
    }
    Mercator.prototype.toRad = function (degrees) {
        return degrees * Math.PI / 180;
    };
    return Mercator;
}());
Mercator = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], Mercator);
exports.Mercator = Mercator;
//# sourceMappingURL=mercator.service.js.map