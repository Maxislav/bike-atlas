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
var auth_service_1 = require("../service/auth.service");
var MyEl = (function (_super) {
    __extends(MyEl, _super);
    function MyEl(id) {
        _super.call(this);
    }
    return MyEl;
}(HTMLElement));
var MapboxGlDirective = (function () {
    function MapboxGlDirective(el, renderer, mapService, positionSiz, ls, as) {
        this.ls = ls;
        this.as = as;
        this.setting = as.setting;
        this.center = [30.5, 50.5];
        this.el = el;
        this.renderer = renderer;
        this.mapService = mapService;
        this.mapService.mapboxgl = mapboxgl;
        this.styleSource = {
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
            }
        };
        var layers = {
            'osm': {
                "id": "osm",
                "source": "osm",
                "type": "raster"
            },
            'ggl': {
                "id": "google-default",
                "source": "google-default",
                "type": "raster"
            },
            hill: {
                "id": "hills",
                "source": "hills",
                "type": "raster",
                "minzoom": 7,
                "maxzoom": 14
            }
        };
        console.log(as.setting);
        this.layers = [];
        if (!as.setting.map || as.setting.map == 'ggl') {
            this.layers.push(layers.ggl);
        }
        if (as.setting.hill) {
            this.layers.push(layers.hill);
        }
        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'rgba(200,200,200, 1)');
        //renderer.setElementStyle(el.nativeElement, 'color', 'white');
        // renderer.setElementStyle(el.nativeElement, 'width', '100%');
        //renderer.setElementStyle(el.nativeElement, 'height', '100%');
        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'gray');
    }
    MapboxGlDirective.prototype.resolve = function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, 5000);
        });
    };
    Object.defineProperty(MapboxGlDirective.prototype, "mapboxgl", {
        get: function () {
            return this._mapboxgl;
        },
        set: function (value) {
            this._mapboxgl = value;
        },
        enumerable: true,
        configurable: true
    });
    MapboxGlDirective.prototype.ngAfterViewInit = function () {
        var localStorageCenter = this.ls.mapCenter;
        var el = this.el;
        el.nativeElement.innerHTML = '';
        mapboxgl.accessToken = "pk.eyJ1IjoibWF4aXNsYXYiLCJhIjoiY2lxbmlsNW9xMDAzNmh4bms4MGQ1enpvbiJ9.SvLPN0ZMYdq1FFMn7djryA";
        this.map = new mapboxgl.Map({
            container: el.nativeElement,
            center: [localStorageCenter.lng || this.center[0], localStorageCenter.lat || this.center[1]],
            zoom: localStorageCenter.zoom || 8,
            style: 'mapbox://styles/mapbox/streets-v9',
            _style: {
                "version": 8,
                "name": "plastun",
                "sprite": "http://" + window.location.hostname + "/src/sprite/sprite",
                "sources": this.styleSource,
                "layers": this.layers
            }
        });
        this.map.addControl(new mapboxgl.NavigationControl({
            position: 'top-right',
            maxWidth: 80
        }));
        this.map.on('load', function () {
            /*this.map.addSource('hill',
                {
                    "type": "raster",
                    "tiles":[
                        "hills/{z}/{x}/{y}.png"
                    ],
                    "tileSize": 256
                });

            this.map.addLayer({
                'id': 'urban-areas-fill',
                'type': 'raster',
                "minzoom": 7,
                "maxzoom": 14,
                'source': 'hill'

            })*/
        });
        this.mapService.setMap(this.map);
    };
    ;
    MapboxGlDirective = __decorate([
        core_1.Directive({
            selector: 'mapbox-gl',
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, map_service_1.MapService, position_size_service_1.PositionSize, local_storage_service_1.LocalStorage, auth_service_1.AuthService])
    ], MapboxGlDirective);
    return MapboxGlDirective;
}());
exports.MapboxGlDirective = MapboxGlDirective;
//# sourceMappingURL=mapbox-gl.directive.js.map