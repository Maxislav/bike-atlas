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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by maxislav on 20.10.16.
 */
const core_1 = require("@angular/core");
let Mercator = class Mercator {
    constructor() {
        this.getYpixel = (fi, z) => {
            var pi = this.Pi;
            var t = Math.tan((pi / 4) + this.toRad(fi) / 2);
            this.dy = (128 / pi) * Math.pow(2, z) * (pi - Math.log(t));
            return Math.round(this.dy);
        };
        this.getXpixel = (la, z) => {
            var pi = this.Pi;
            return (128 / pi) * Math.pow(2, z) * (this.toRad(la) + pi);
        };
        this.Pi = Math.PI;
        this.getXpixel;
    }
    toRad(degrees) {
        return degrees * Math.PI / 180;
    }
};
Mercator = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], Mercator);
exports.Mercator = Mercator;
//# sourceMappingURL=mercator.service.js.map