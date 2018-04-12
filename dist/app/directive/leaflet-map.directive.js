"use strict";
/**
 * Created by maxislav on 10.10.16.
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
const map_service_1 = require("../service/map.service");
const position_size_service_1 = require("../service/position-size.service");
class MyEl extends HTMLElement {
    constructor(id) {
        super();
    }
}
let LeafletMapDirective = class LeafletMapDirective {
    constructor(el, renderer, mapService, positionSiz) {
        this.el = el;
        this.renderer = renderer;
        this.mapService = mapService;
        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'rgba(200,200,200, 1)');
        renderer.setElementStyle(el.nativeElement, 'color', 'white');
        renderer.setElementStyle(el.nativeElement, 'width', '512px');
        renderer.setElementStyle(el.nativeElement, 'height', '512px');
        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'gray');
    }
    ngAfterViewInit() {
        let el = this.el;
        el.nativeElement.innerHTML = '';
        mapboxgl.accessToken = "pk.eyJ1IjoibWF4aXNsYXYiLCJhIjoiY2lxbmlsNW9xMDAzNmh4bms4MGQ1enpvbiJ9.SvLPN0ZMYdq1FFMn7djryA";
        this.map = new mapboxgl.Map({
            container: el.nativeElement,
            center: [30.5, 50.5],
            zoom: 8,
            _style: 'mapbox://styles/mapbox/streets-v9',
            style: {
                "version": 8,
                "name": "plastun",
                "sprite": "mapbox://sprites/mapbox/streets-v8",
                "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
                "sources": {
                    "satelite-google": {
                        "type": "raster",
                        "tiles": [
                            "http://iis.contour.net:8081/map/g.h/{z}/{x}/{y}"
                        ],
                        "tileSize": 256
                    },
                    "google-default": {
                        "type": "raster",
                        "tiles": [
                            "http://mt0.googleapis.com/vt/lyrs=m@207000000&hl=ru&src=api&x={x}&y={y}&z={z}&s=Galile"
                        ],
                        "tileSize": 256
                    }
                },
                "layers": [{
                        "id": "google-default",
                        "source": "google-default",
                        "type": "raster"
                    }]
            }
        });
        this.map.addControl(new mapboxgl.NavigationControl({
            position: 'top-right',
            maxWidth: 80
        }));
        /*console.log(L.map);
        this.map = L.map(el.nativeElement).setView([50.5, 30.5], 8);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);*/
        //this.mapService.setMap(this.map);
    }
    ;
};
LeafletMapDirective = __decorate([
    core_1.Directive({
        selector: 'leaflet-map',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer, map_service_1.MapService, position_size_service_1.PositionSize])
], LeafletMapDirective);
exports.LeafletMapDirective = LeafletMapDirective;
//# sourceMappingURL=leaflet-map.directive.js.map