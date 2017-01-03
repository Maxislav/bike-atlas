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
    function MarkerService(maps) {
        this.maps = maps;
        this.layerIds = [];
    }
    MarkerService.prototype.marker = function (p, name) {
        var point = {
            "type": "Point",
            "coordinates": [p.lng, p.lat],
            "bearing": p.bearing
        };
        var map = this.maps.map;
        var mapBearing = map.getBearing();
        var F = parseFloat;
        var layerId = this.getNewLayer(0, 5000000, true) + '';
        map.addSource(layerId, { type: 'geojson', data: point });
        map.addLayer({
            "id": layerId,
            "type": "symbol",
            "source": layerId,
            "layout": {
                "icon-image": "arrow",
                "icon-rotate": point.bearing
            }
        });
        var mapboxgl = this.maps.mapboxgl;
        //console.log()
        var popup = new mapboxgl.Popup({ closeOnClick: false, offset: [0, -15], closeButton: false })
            .setLngLat(point.coordinates)
            .setHTML('<div>' + name + '</div>')
            .addTo(map);
        var marker = {
            id: layerId,
            popup: popup,
            setCenter: function (_point) {
                point.coordinates = [_point.lng, _point.lat];
                if (_point.bearing) {
                    map.setLayoutProperty(layerId, 'icon-rotate', _point.bearing - map.getBearing());
                }
                popup.setLngLat(point.coordinates);
                map.getSource(layerId).setData(point);
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
            }
        };
        function move() {
            if (map.getBearing() != mapBearing) {
                marker.update();
                mapBearing = map.getBearing();
            }
        }
        map.on('move', move);
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
//# sourceMappingURL=marker.service.js.map