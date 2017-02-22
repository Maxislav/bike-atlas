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
const core_1 = require('@angular/core');
const local_storage_service_1 = require('../service/local-storage.service');
let MapService = class MapService {
    // public ls: LocalStorage
    //private ref: ApplicationRef
    constructor(ref, ls) {
        this.ref = ref;
        this.ls = ls;
        this.events = {
            load: []
        };
        this._onLoad = new Promise((resolve, reject) => {
            this._resolve = resolve;
        });
    }
    setMap(map) {
        this.map = map;
        //this.trackService.setMap(map);
        map.on('load', () => {
            this.pitch = map.getPitch().toFixed(0);
            this.bearing = map.getBearing().toFixed(1);
            this.zoom = map.getZoom().toFixed(1);
            let LngLat = map.getCenter();
            this.lngMap = LngLat.lng.toFixed(4);
            this.latMap = LngLat.lat.toFixed(4);
            this._resolve(map);
            this.ref.tick();
        });
        map.on('mousemove', (e) => {
            this.lat = e.lngLat.lat.toFixed(4);
            this.lng = e.lngLat.lng.toFixed(4);
            this.ref.tick();
        });
        map.on('move', (e) => {
            //console.log()
            this.pitch = map.getPitch().toFixed(0);
            this.bearing = map.getBearing().toFixed(1);
            this.zoom = map.getZoom().toFixed(1);
            let LngLat = map.getCenter();
            this.lngMap = LngLat.lng.toFixed(4);
            this.latMap = LngLat.lat.toFixed(4);
            this.ref.tick();
        });
        map.on('moveend', () => {
            let LngLat = map.getCenter();
            let opt = {
                lng: LngLat.lng,
                lat: LngLat.lat,
                zoom: map.getZoom()
            };
            this.ls.mapCenter = opt;
        });
    }
    registerEvent(name, f) {
        this.events[name] = this.events[name] || [];
        this.events[name].push(f);
    }
    registerChanges(foo) {
        this.foo = foo;
    }
    onTrack(arr) {
    }
    get onLoad() {
        return this._onLoad;
    }
    get mapboxgl() {
        return this._mapboxgl;
    }
    set mapboxgl(value) {
        this._mapboxgl = value;
    }
    get map() {
        return this._map;
    }
    set map(value) {
        this._map = value;
    }
};
MapService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [core_1.ApplicationRef, local_storage_service_1.LocalStorage])
], MapService);
exports.MapService = MapService;
//# sourceMappingURL=map.service.js.map