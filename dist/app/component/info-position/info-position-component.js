"use strict";
/**
 * Created by maxislav on 20.10.16.
 */
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
const map_service_1 = require("../../service/map.service");
const mercator_service_1 = require("../../service/mercator.service");
let InfoPositionComponent = class InfoPositionComponent {
    constructor(mercator, mapService) {
        this.changes = (lat, lng, zoom) => {
            this.mapService.latMap = lat;
            this.mapService.lngMap = lng;
            //console.log(lat, lng)
            // this.pixelY = this.mercator.getYpixel(lat, zoom);
            //this.pixelX = this.mercator.getYpixel(lng, zoom);
        };
        this.mercator = mercator;
        this.mapService = mapService;
        mapService.registerChanges(this.changes);
    }
};
InfoPositionComponent = __decorate([
    core_1.Component({
        selector: 'info-position',
        //template:'<div>lat: {{mapService.lat}}</div>' + '<div>Pixel: {{pixelY}}</div>',
        templateUrl: 'dist/app/component/info-position/info-position-component.html',
        styleUrls: ['dist/app/component/info-position/info-position.css']
    }),
    __metadata("design:paramtypes", [mercator_service_1.Mercator, map_service_1.MapService])
], InfoPositionComponent);
exports.InfoPositionComponent = InfoPositionComponent;
//# sourceMappingURL=info-position-component.js.map