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
var core_1 = require('@angular/core');
var mercator_service_1 = require('./service/mercator.service');
var hero_service_1 = require("./hero.service");
var map_service_1 = require("./service/map.service");
var mapbox_gl_directive_1 = require("./directive/mapbox-gl.directive");
var MapComponent = (function () {
    function MapComponent(mercator, mapService) {
    }
    MapComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            template: [
                '<info-position>',
                '</info-position>',
                '<mapbox-gl> map loading...</mapbox-gl>'].join(''),
            styleUrls: ['css/map.component.css'],
            directives: [mapbox_gl_directive_1.MapboxGlDirective],
            providers: [hero_service_1.HeroService]
        }), 
        __metadata('design:paramtypes', [mercator_service_1.Mercator, map_service_1.MapService])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
