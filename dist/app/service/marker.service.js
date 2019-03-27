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
const map_service_1 = require("./map.service");
const timer_service_1 = require("./timer.service");
const elapsed_status_1 = require("../util/elapsed-status");
const track_var_1 = require("./track.var");
const tail_class_1 = require("./tail.class");
const distance_1 = require("../util/distance");
const BehaviorSubject_1 = require("rxjs/BehaviorSubject");
class Marker {
    constructor(devData, user, mapboxgl, map, timerService) {
        this.user = user;
        this.mapboxgl = mapboxgl;
        this.map = map;
        this.timerService = timerService;
        this.status = 'white';
        Object.keys(devData).forEach(key => {
            this[key] = devData[key];
        });
        this.speedBehaviorSubject = new BehaviorSubject_1.BehaviorSubject(0);
        this.speedSubject = this.speedBehaviorSubject.asObservable();
        this.timer = new timer_service_1.Timer(devData.date);
        this.layerId = Marker.getNewLayer(0, 5000000, true) + '';
        const icoContainer = document.createElement('div');
        icoContainer.classList.add("user-icon");
        const img = this.img = new Image();
        img.src = this.user.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);
        this.icoContainer = icoContainer;
        this.popup = new mapboxgl.Popup({ closeOnClick: false, offset: {
                'bottom': [0, -20],
            }, closeButton: false })
            .setLngLat([devData.lng, devData.lat])
            .setHTML('<div>' + devData.name + '</div>')
            .addTo(map);
        this.iconMarker = new mapboxgl.Marker(icoContainer, { offset: [0, 0] })
            .setLngLat([devData.lng, devData.lat])
            .addTo(map);
        this.image = user.image || 'src/img/no-avatar.gif';
        this.elapsed = '...';
        this.tail = new tail_class_1.TailClass(this.layerId, this.map);
        this.intervalUpdateMarker = setInterval(() => {
            this.updateMarker();
        }, 1000);
    }
    update(devData) {
        const prevLngLat = new track_var_1.Point(this.lng, this.lat);
        const t = this.timer.tick(devData.date);
        for (let opt in devData) {
            this[opt] = devData[opt];
        }
        const nextLngLat = new track_var_1.Point(this.lng, this.lat);
        this.speed = 3600 * 1000 * distance_1.distance(prevLngLat, nextLngLat) / t; //km/h
        this.speedBehaviorSubject.next(this.speed);
        this.popup.setLngLat([this.lng, this.lat]);
        this.status = elapsed_status_1.elapsedStatus(this);
        this.iconMarker.setLngLat([this.lng, this.lat]);
        this.icoContainer.setAttribute('status', this.status);
        this.tail.update(new track_var_1.Point(devData.lng, devData.lat));
        return this;
    }
    updateMarker() {
        this.status = elapsed_status_1.elapsedStatus(this);
        this.icoContainer.setAttribute('status', this.status);
        this.elapsed = this.timerService.elapse(this.date);
        return this;
    }
    remove() {
        this.popup.remove();
        this.iconMarker.remove();
        this.intervalUpdateMarker && clearInterval(this.intervalUpdateMarker);
    }
    ;
    updateSetImage(src) {
        this.img.src = src;
        this.image = src;
    }
    static getNewLayer(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = 'marker' + Math.round(rand);
        }
        if (Marker.layerIds.has(rand)) {
            return Marker.getNewLayer(min, max, int);
        }
        Marker.layerIds.add(rand);
        return rand;
    }
}
Marker.layerIds = new Set();
exports.Marker = Marker;
let MarkerService = class MarkerService {
    constructor(mapService, timer) {
        this.mapService = mapService;
        this.timer = timer;
    }
    marker(devData, user) {
        return new Marker(devData, user, this.mapService.mapboxgl, this.mapService.map, this.timer);
    }
};
MarkerService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [map_service_1.MapService, timer_service_1.TimerService])
], MarkerService);
exports.MarkerService = MarkerService;
//# sourceMappingURL=marker.service.js.map