"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
//import any = jasmine.any;
var map_service_1 = require("../service/map.service");
var position_size_service_1 = require("../service/position-size.service");
var local_storage_service_1 = require('../service/local-storage.service');
var mapboxgl = require("@lib/mapbox-gl/mapbox-gl.js");
var MyEl = (function (_super) {
    __extends(MyEl, _super);
    function MyEl(id) {
        _super.call(this);
    }
    return MyEl;
}(HTMLElement));
var MapboxGlDirective = (function () {
    function MapboxGlDirective(el, renderer, mapService, positionSiz, ls) {
        this.ls = ls;
        this.center = [30.5, 50.5];
        this.el = el;
        this.renderer = renderer;
        this.mapService = mapService;
        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'rgba(200,200,200, 1)');
        //renderer.setElementStyle(el.nativeElement, 'color', 'white');
        // renderer.setElementStyle(el.nativeElement, 'width', '100%');
        //renderer.setElementStyle(el.nativeElement, 'height', '100%');
        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'gray');
    }
    MapboxGlDirective.prototype.ngAfterViewInit = function () {
        var localStorageCenter = this.ls.mapCenter;
        var el = this.el;
        el.nativeElement.innerHTML = '';
        mapboxgl.accessToken = "pk.eyJ1IjoibWF4aXNsYXYiLCJhIjoiY2lxbmlsNW9xMDAzNmh4bms4MGQ1enpvbiJ9.SvLPN0ZMYdq1FFMn7djryA";
        this.map = new mapboxgl.Map({
            container: el.nativeElement,
            center: [localStorageCenter.lng || this.center[0], localStorageCenter.lat || this.center[1]],
            zoom: localStorageCenter.zoom || 8,
            //"sprite": "http://localhost:8080/src/img/milsymbol",
            // _style: 'mapbox://styles/mapbox/streets-v9',
            style: {
                "version": 8,
                "name": "plastun",
                // "sprite": "mapbox://sprites/mapbox/streets-v8",
                // "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
                "sprite": "http://" + window.location.hostname + "/src/sprite/sprite",
                "sources": {
                    "google-default": {
                        "type": "raster",
                        "tiles": [
                            "http://mt0.googleapis.com/vt/lyrs=m@207000000&hl=ru&src=api&x={x}&y={y}&z={z}&s=Galile",
                        ],
                        "tileSize": 256
                    },
                    "hills": {
                        "type": "raster",
                        "tiles": [
                            "hills/{z}/{x}/{y}.png"
                        ],
                        "tileSize": 256
                    },
                    "osm": {
                        "type": "raster",
                        "tiles": [
                            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ],
                        "tileSize": 256
                    },
                },
                "layers": [{
                        "id": "google-default",
                        "source": "osm",
                        "type": "raster"
                    }, {
                        "id": "hills",
                        "source": "hills",
                        "type": "raster"
                    }]
            }
        });
        this.map.addControl(new mapboxgl.NavigationControl({
            position: 'top-right',
            maxWidth: 80
        }));
        this.mapService.setMap(this.map);
    };
    ;
    MapboxGlDirective = __decorate([
        core_1.Directive({
            selector: 'mapbox-gl',
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, map_service_1.MapService, position_size_service_1.PositionSize, local_storage_service_1.LocalStorage])
    ], MapboxGlDirective);
    return MapboxGlDirective;
}());
exports.MapboxGlDirective = MapboxGlDirective;
//# sourceMappingURL=mapbox-gl.directive.js.map