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
var PrivateAreaService = (function () {
    function PrivateAreaService(mapService) {
        var _this = this;
        this.mapService = mapService;
        this.layerIds = [];
        this.onLoadMap = mapService.onLoad;
        mapService.onLoad.then(function (_map) {
            _this.map = _map;
        });
    }
    PrivateAreaService.prototype.createArea = function (_a, r) {
        var lng = _a[0], lat = _a[1];
        var layerId = this.getNewLayerId();
        var radius = r || 0.5;
        var map = this.map;
        this.map.addSource(layerId, {
            type: "geojson",
            data: createGeoJSONCircle([lng, lat], radius)
        });
        this.map.addLayer({
            "id": layerId,
            "type": "fill",
            "source": layerId,
            "layout": {},
            "paint": {
                "fill-color": "red",
                "fill-opacity": 0.3
            }
        });
        function createGeoJSONCircle(center, radiusInKm, points) {
            if (!points)
                points = 64;
            var coords = {
                latitude: center[1],
                longitude: center[0]
            };
            var km = radiusInKm;
            var ret = [];
            var distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
            var distanceY = km / 110.574;
            var theta, x, y;
            for (var i = 0; i < points; i++) {
                theta = (i / points) * (2 * Math.PI);
                x = distanceX * Math.cos(theta);
                y = distanceY * Math.sin(theta);
                ret.push([coords.longitude + x, coords.latitude + y]);
            }
            ret.push(ret[0]);
            return {
                "type": "FeatureCollection",
                "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [ret]
                        }
                    }]
            };
        }
        ;
        return {
            id: layerId,
            lng: lng,
            lat: lat,
            radius: radius,
            update: function (_a, r) {
                var lng = _a[0], lat = _a[1];
                this.lng = lng;
                this.lat = lat;
                map.getSource(layerId)
                    .setData(createGeoJSONCircle([lng, lat], r));
            },
            remove: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
            }
        };
    };
    PrivateAreaService.prototype.getNewLayerId = function () {
        var min = 0, max = 10000;
        var rand = (min + Math.random() * (max - min));
        var newId = ('area' + Math.round(rand)).toString();
        if (-1 < this.layerIds.indexOf(newId)) {
            return this.getNewLayerId();
        }
        else {
            this.layerIds.push(newId);
            return newId;
        }
    };
    PrivateAreaService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [map_service_1.MapService])
    ], PrivateAreaService);
    return PrivateAreaService;
}());
exports.PrivateAreaService = PrivateAreaService;
//# sourceMappingURL=private.area.service.js.map