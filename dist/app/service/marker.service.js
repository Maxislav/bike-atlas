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
var core_1 = require("@angular/core");
var map_service_1 = require("./map.service");
var timer_service_1 = require("./timer.service");
var deep_copy_1 = require("../util/deep-copy");
var elapsed_status_1 = require("../util/elapsed-status");
var MarkerService = (function () {
    function MarkerService(mapService, timer) {
        this.mapService = mapService;
        this.timer = timer;
        this.layerIds = [];
    }
    MarkerService.prototype.marker = function (devData, user) {
        var marker = deep_copy_1.deepCopy(devData);
        var map = this.mapService.map;
        var layerId = this.getNewLayer(0, 5000000, true) + '';
        var mapboxgl = this.mapService.mapboxgl;
        var mapBearing = map.getBearing();
        var icoContainer = document.createElement('div');
        icoContainer.classList.add("user-icon");
        icoContainer.setAttribute('status', elapsed_status_1.elapsedStatus(devData));
        var img = new Image();
        img.src = user.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);
        var popup = new mapboxgl.Popup({ closeOnClick: false, offset: [0, -15], closeButton: false })
            .setLngLat([devData.lng, devData.lat])
            .setHTML('<div>' + devData.name + '</div>')
            .addTo(map);
        var iconMarker = new mapboxgl.Marker(icoContainer, { offset: [-20, -20] })
            .setLngLat([devData.lng, devData.lat])
            .addTo(map);
        var intervalUpdateMarker = null;
        var timer = this.timer;
        marker.updateSetImage = function (src) {
            img.src = src;
            this.image = src;
        };
        marker.image = user.image || 'src/img/no-avatar.gif';
        marker.elapsed = '...';
        marker.update = function (devData) {
            for (var opt in devData) {
                this[opt] = devData[opt];
            }
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
        intervalUpdateMarker = setInterval(function () {
            marker.updateMarker();
        }, 1000);
        return marker;
    };
    MarkerService.prototype.getNewLayer = function (min, max, int) {
        var rand = min + Math.random() * (max - min);
        if (int) {
            rand = 'marker' + Math.round(rand);
        }
        if (-1 < this.layerIds.indexOf(rand)) {
            return this.getNewLayer(min, max, int);
        }
        else {
            return rand;
        }
    };
    return MarkerService;
}());
MarkerService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [map_service_1.MapService, timer_service_1.TimerService])
], MarkerService);
exports.MarkerService = MarkerService;
//# sourceMappingURL=marker.service.js.map