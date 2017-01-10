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
var socket_oi_service_1 = require("./socket.oi.service");
var PrivateAreaService = (function () {
    function PrivateAreaService(mapService, io) {
        var _this = this;
        this.mapService = mapService;
        this.io = io;
        this._areas = [];
        this.socket = io.socket;
        this.layerIds = [];
        this.onLoadMap = mapService.onLoad;
        mapService.onLoad.then(function (_map) {
            _this.map = _map;
        });
    }
    PrivateAreaService.prototype.onSave = function (area) {
        var _this = this;
        return this.socket.$emit('savePrivateArea', area)
            .then(function (d) {
            if (d && d.result == 'ok') {
                _this.showArea();
                return true;
            }
            return false;
        });
    };
    PrivateAreaService.prototype.showArea = function () {
        var _this = this;
        return this.socket.$emit('getPrivateArea')
            .then(function (d) {
            return _this.areas = d.areas;
        });
    };
    PrivateAreaService.prototype.hideArea = function () {
        while (this._areas.length) {
            this._areas.shift().remove();
        }
    };
    PrivateAreaService.prototype.removeArea = function (id) {
        var _this = this;
        this.socket.$emit('removeArea', id)
            .then(function (d) {
            if (d && d.result == 'ok') {
                _this.showArea();
            }
            else {
                console.error(d);
            }
        });
    };
    Object.defineProperty(PrivateAreaService.prototype, "areas", {
        get: function () {
            return this._areas;
        },
        set: function (value) {
            var _this = this;
            while (this._areas.length) {
                this._areas.shift().remove();
            }
            this._areas.length = 0;
            value.forEach(function (ar) {
                var area = _this.createArea(ar);
                _this._areas.push(area);
            });
        },
        enumerable: true,
        configurable: true
    });
    PrivateAreaService.prototype.createArea = function (area) {
        var layerId = this.getNewLayerId();
        var radius = area.radius || 0.5;
        var map = this.map;
        this.map.addSource(layerId, {
            type: "geojson",
            data: createGeoJSONCircle([area.lng, area.lat], radius)
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
            id: area.id || null,
            layerId: layerId,
            lng: area.lng,
            lat: area.lat,
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
        __metadata('design:paramtypes', [map_service_1.MapService, socket_oi_service_1.Io])
    ], PrivateAreaService);
    return PrivateAreaService;
}());
exports.PrivateAreaService = PrivateAreaService;
//# sourceMappingURL=private.area.service.js.map