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
var MarkerService = (function () {
    function MarkerService(mapService) {
        this.mapService = mapService;
        this.layerIds = [];
    }
    MarkerService.prototype.marker = function (deviceData) {
        var _deviceData = deviceData;
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
            map.addSource(layerId, { type: 'geojson', data: point });
            map.addLayer({
                "id": layerId,
                "type": "symbol",
                "source": layerId,
                "layout": {
                    "icon-image": getIconImage(deviceData),
                    "icon-rotate": point.bearing
                }
            });
        });
        var mapboxgl = this.mapService.mapboxgl;
        var popup = new mapboxgl.Popup({ closeOnClick: false, offset: [0, -15], closeButton: false })
            .setLngLat(point.coordinates)
            .setHTML('<div>' + deviceData.name + '</div>')
            .addTo(map);
        var timer = null;
        var marker = {
            id: layerId,
            popup: popup,
            setCenter: function (d) {
                _deviceData = d;
                point.coordinates = [d.lng, d.lat];
                if (d.azimuth) {
                    map.setLayoutProperty(layerId, 'icon-rotate', d.azimuth - map.getBearing());
                }
                console.log(this);
                this.updateMarker(d);
                popup.setLngLat(point.coordinates);
                map.getSource(layerId).setData(point);
            },
            updateMarker: function (d) {
                map.setLayoutProperty(layerId, 'icon-image', getIconImage(d));
            },
            update: function () {
                map.setLayoutProperty(layerId, 'icon-rotate', point.bearing - map.getBearing());
                map.getSource(layerId).setData(point);
            },
            hide: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                console.log('delete marker id', layerId);
                map.off('move', move);
                timer && clearInterval(timer);
            }
        };
        function move() {
            if (map.getBearing() != mapBearing) {
                marker.update();
                mapBearing = map.getBearing();
            }
        }
        map.on('move', move);
        timer = setInterval(function () {
            marker.updateMarker(_deviceData);
        }, 10000);
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
        __metadata('design:paramtypes', [map_service_1.MapService])
    ], MarkerService);
    return MarkerService;
}());
exports.MarkerService = MarkerService;
function getIconImage(device) {
    /* alert(new Date(device.date))
     return 'green';*/
    var dateLong = new Date((new Date(device.date).getTime() - (new Date().getTimezoneOffset() * 60 * 1000))).getTime();
    var passed = new Date().getTime() - dateLong;
    if (passed < 10 + 60 * 1000) {
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