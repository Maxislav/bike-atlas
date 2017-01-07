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
var MarkerService = (function () {
    function MarkerService(mapService, timer) {
        this.mapService = mapService;
        this.timer = timer;
        this.layerIds = [];
    }
    MarkerService.prototype.marker = function (deviceData) {
        var point = {
            "type": "Point",
            "coordinates": [deviceData.lng, deviceData.lat],
            "bearing": deviceData.azimuth
        };
        var map = this.mapService.map;
        var mapBearing = map.getBearing();
        var F = parseFloat;
        var layerId = this.getNewLayer(0, 5000000, true) + '';
        this.mapService.onLoad.then(function () {
            /* map.addSource(layerId, { type: 'geojson', data: point });
             map.addLayer({
                 "id": layerId,
                 "type": "symbol",
                 "source": layerId,
                 "layout": {
                     "icon-image": getIconImage(deviceData),
                     "icon-rotate": point.bearing
                 }
             });*/
        });
        var mapboxgl = this.mapService.mapboxgl;
        var icoContainer = document.createElement('div');
        icoContainer.classList.add("user-icon");
        icoContainer.setAttribute('status', getIconImage(deviceData));
        var img = new Image();
        img.src = deviceData.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);
        var popup = new mapboxgl.Popup({ closeOnClick: false, offset: [0, -15], closeButton: false })
            .setLngLat(point.coordinates)
            .setHTML('<div>' + deviceData.name + '</div>')
            .addTo(map);
        var iconMarker = new mapboxgl.Marker(icoContainer, { offset: [-20, -20] })
            .setLngLat(point.coordinates)
            .addTo(map);
        var intervalUpdateMarker = null;
        var timer = this.timer;
        var marker = {
            id: layerId,
            popup: popup,
            deviceData: deviceData,
            timePassed: 0,
            elapsed: '...',
            status: getIconImage(deviceData),
            updateMarker: function () {
                this.status = getIconImage(this.deviceData);
                icoContainer.setAttribute('status', this.status);
                this.elapsed = timer.elapse(this.deviceData.date);
            },
            update: function (d) {
                for (var opt in d) {
                    this.deviceData[opt] = d[opt];
                }
                point.coordinates = [d.lng, d.lat];
                popup.setLngLat(point.coordinates);
                iconMarker.setLngLat(point.coordinates);
                this.status = getIconImage(this.deviceData);
                icoContainer.setAttribute('status', this.status);
                //map.getSource(layerId).setData(point);
            },
            rotate: function () {
                map.setLayoutProperty(layerId, 'icon-rotate', point.bearing - map.getBearing());
                map.getSource(layerId).setData(point);
            },
            hide: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                popup.remove();
                console.log('delete marker id', layerId);
                iconMarker.remove();
                intervalUpdateMarker && clearInterval(intervalUpdateMarker);
            }
        };
        function move() {
            if (map.getBearing() != mapBearing) {
                marker.rotate();
                mapBearing = map.getBearing();
            }
        }
        intervalUpdateMarker = setInterval(function () {
            marker.updateMarker();
            //this.timer.elapse(this.deviceData.date)
        }, 1000);
        /*map.on('move', move);
        intervalUpdateMarker = setInterval(()=>{
            marker.updateMarker();
        }, 10000);*/
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
    MarkerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [map_service_1.MapService, timer_service_1.TimerService])
    ], MarkerService);
    return MarkerService;
}());
exports.MarkerService = MarkerService;
function getIconImage(device) {
    var dateLong = new Date(device.date).getTime();
    var passed = new Date().getTime() - dateLong;
    if (passed < 10 * 60 * 1000) {
        if (device.speed < 0.1) {
            return 'green';
        }
        else {
            return 'arrow';
        }
    }
    else if (passed < 3600 * 12 * 1000) {
        return 'yellow';
    }
    else {
        return 'white';
    }
}
//# sourceMappingURL=marker.service.js.map