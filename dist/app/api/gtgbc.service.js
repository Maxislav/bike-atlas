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
const core_1 = require("@angular/core");
const socket_oi_service_1 = require("../service/socket.oi.service");
let GtgbcService = class GtgbcService {
    constructor(io) {
        this.io = io;
        this.socket = io.socket;
    }
    getLatLng(arr) {
        console.log(arr);
        return this.socket.$emit('onGtgbc', arr)
            .then(d => {
            const resArr = d.result.map((str, i) => {
                const lat = str.match(/Lat=-?[\d\.]+/)[0].replace(/^Lat=/, '');
                const lng = str.match(/Lon=-?[\d\.]+/)[0].replace(/^Lon=/, '');
                return {
                    lat: Number(lat),
                    lng: Number(lng),
                    id: arr[i].cellId
                };
            });
            return resArr;
        });
    }
};
GtgbcService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [socket_oi_service_1.Io])
], GtgbcService);
exports.GtgbcService = GtgbcService;
//# sourceMappingURL=gtgbc.service.js.map