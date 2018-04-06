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
const core_1 = require("@angular/core");
const map_service_1 = require("./map.service");
const track_var_1 = require("./track.var");
const timer_service_1 = require("./timer.service");
const deep_copy_1 = require("../util/deep-copy");
const elapsed_status_1 = require("../util/elapsed-status");
const tail_class_1 = require("../util/tail.class");
class Marker {
    constructor(devData, user, mapboxgl) {
        this.user = user;
        this.mapboxgl = mapboxgl;
        Object.keys(devData).forEach(key => {
            this[key] = devData[key];
        });
        this.layerId = Marker.getNewLayer(0, 5000000, true) + '';
        const icoContainer = document.createElement('div');
        icoContainer.classList.add("user-icon");
        const img = new Image();
        img.src = this.user.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);
        this.icoContainer = icoContainer;
    }
    updateMarker() {
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
let MarkerService = class MarkerService {
    constructor(mapService, timer) {
        this.mapService = mapService;
        this.timer = timer;
        this.layerIds = [];
    }
    marker(devData, user) {
        const m = new Marker(devData, user, this.mapService.mapboxgl);
        const marker = deep_copy_1.deepCopy(devData);
        const map = this.mapService.map;
        const layerId = this.getNewLayer(0, 5000000, true) + '';
        const mapboxgl = this.mapService.mapboxgl;
        let mapBearing = map.getBearing();
        const icoContainer = document.createElement('div');
        icoContainer.classList.add("user-icon");
        icoContainer.setAttribute('status', elapsed_status_1.elapsedStatus(devData));
        const img = new Image();
        img.src = user.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);
        const popup = new mapboxgl.Popup({ closeOnClick: false, offset: [0, -15], closeButton: false })
            .setLngLat([devData.lng, devData.lat])
            .setHTML('<div>' + devData.name + '</div>')
            .addTo(map);
        const iconMarker = new mapboxgl.Marker(icoContainer, { offset: [-20, -20] })
            .setLngLat([devData.lng, devData.lat])
            .addTo(map);
        let intervalUpdateMarker = null;
        const timer = this.timer;
        marker.tail = new tail_class_1.Tail(new track_var_1.Point(devData.lng, devData.lat), map);
        marker.updateSetImage = function (src) {
            src = src || 'src/img/no-avatar.gif';
            img.src = src;
            this.image = src;
        };
        marker.image = user.image || 'src/img/no-avatar.gif';
        marker.elapsed = '...';
        //TODO остановился тут
        marker.update = function (devData) {
            for (let opt in devData) {
                this[opt] = devData[opt];
            }
            this.tail.update(new track_var_1.Point(this.lng, this.lat));
            console.log(this.tail);
            popup.setLngLat([this.lng, this.lat]);
            iconMarker.setLngLat([this.lng, this.lat]);
            this.status = elapsed_status_1.elapsedStatus(this);
            icoContainer.setAttribute('status', this.status);
        };
        marker.updateMarker = function () {
            this.status = elapsed_status_1.elapsedStatus(this);
            icoContainer.setAttribute('status', this.status);
            this.elapsed = timer.elapse(this.date);
        };
        marker.remove = function () {
            popup.remove();
            console.log('delete marker id', layerId);
            iconMarker.remove();
            intervalUpdateMarker && clearInterval(intervalUpdateMarker);
        };
        intervalUpdateMarker = setInterval(() => {
            marker.updateMarker();
        }, 1000);
        return marker;
    }
    getNewLayer(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = 'marker' + Math.round(rand);
        }
        if (-1 < this.layerIds.indexOf(rand)) {
            return this.getNewLayer(min, max, int);
        }
        else {
            return rand;
        }
    }
};
MarkerService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [map_service_1.MapService, timer_service_1.TimerService])
], MarkerService);
exports.MarkerService = MarkerService;
//# sourceMappingURL=marker.service.js.map