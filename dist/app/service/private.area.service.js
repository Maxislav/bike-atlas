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
const socket_oi_service_1 = require("./socket.oi.service");
const toast_component_1 = require("../component/toast/toast.component");
/*
export  interface Area{
    id?: number;
    lng: number;
    lat: number;
    layerId: string,
    radius: number;
    update: Function;
    remove: Function;
}*/
let PrivateAreaService = class PrivateAreaService {
    constructor(mapService, io, toast) {
        this.mapService = mapService;
        this.io = io;
        this.toast = toast;
        this._areas = [];
        this.socket = io.socket;
        this.layerIds = [];
        this.onLoadMap = mapService.onLoad;
        mapService.onLoad.then(_map => {
            this.map = _map;
        });
    }
    onSave(area) {
        return this.socket.$emit('savePrivateArea', area)
            .then(d => {
            if (d && d.result == 'ok') {
                this.showArea();
                return true;
            }
            return false;
        });
    }
    showArea() {
        return this.socket.$emit('getPrivateArea')
            .then(d => {
            return this.areas = d.areas;
        });
    }
    hideArea() {
        while (this._areas.length) {
            this._areas.shift().remove();
        }
    }
    removeArea(id) {
        this.socket.$emit('removeArea', id)
            .then(d => {
            if (d && d.result == 'ok') {
                this.showArea();
            }
            else {
                console.error(d);
            }
        });
    }
    get areas() {
        return this._areas;
    }
    set areas(value) {
        while (this._areas.length) {
            this._areas.shift().remove();
        }
        this._areas.length = 0;
        value.forEach(ar => {
            const area = this.createArea(ar);
            this._areas.push(area);
        });
    }
    createArea(area) {
        const layerId = this.getNewLayerId();
        const radius = area.radius || 0.5;
        const map = this.map;
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
            const coords = {
                latitude: center[1],
                longitude: center[0]
            };
            const km = radiusInKm;
            const ret = [];
            let distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
            let distanceY = km / 110.574;
            let theta, x, y;
            for (let i = 0; i < points; i++) {
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
            update: function ([lng, lat], r) {
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
    }
    saveLock(value) {
        return this.socket.$emit('lockPrivateArea', value)
            .then(d => {
            console.log(d);
            if (d && d.result == 'ok') {
                this.toast.show({
                    type: 'warning',
                    text: 'Настройки приватности изменены'
                });
            }
        });
    }
    getNewLayerId() {
        const min = 0, max = 10000;
        let rand = (min + Math.random() * (max - min));
        const newId = ('area' + Math.round(rand)).toString();
        if (-1 < this.layerIds.indexOf(newId)) {
            return this.getNewLayerId();
        }
        else {
            this.layerIds.push(newId);
            return newId;
        }
    }
};
PrivateAreaService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [map_service_1.MapService, socket_oi_service_1.Io, toast_component_1.ToastService])
], PrivateAreaService);
exports.PrivateAreaService = PrivateAreaService;
//# sourceMappingURL=private.area.service.js.map