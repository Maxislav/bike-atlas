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
const lngLat_1 = require("../util/lngLat");
class Marker {
    //TODO creating and update user marker
    constructor(devData, user, mapboxgl, map, timerService) {
        this.user = user;
        this.mapboxgl = mapboxgl;
        this.map = map;
        this.timerService = timerService;
        this.status = 'white';
        console.log(devData.type);
        Object.keys(devData).forEach(key => {
            this[key] = devData[key];
        });
        this.speedBehaviorSubject = new BehaviorSubject_1.BehaviorSubject(0);
        this.speedSubject = this.speedBehaviorSubject.asObservable();
        this.timer = new timer_service_1.Timer(devData.date);
        this.layerId = Marker.getNewLayer();
        const icoContainer = document.createElement('div');
        icoContainer.classList.add('user-icon');
        const img = this.img = new Image();
        img.src = this.user.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);
        this.icoContainer = icoContainer;
        this.popup = new mapboxgl.Popup({
            closeOnClick: false, offset: {
                'bottom': [0, -20],
            }, closeButton: false
        })
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
        if (devData.type === 'BS') {
            this.map.onLoad
                .then(m => {
                this.createStations(devData.bs);
            });
        }
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
        if (this.areaList) {
            this.areaList.remove();
        }
        if (this.baseStationPoints) {
            this.baseStationPoints.remove();
        }
        if (devData.type === 'BS') {
            this.createStations(devData.bs);
        }
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
    createStations(pointsList) {
        // this.baseStationLayerId = Marker.getNewLayer();
        const { bounds, max } = this.getBouds(pointsList);
        this.areaList = this.createAreaList(pointsList, max);
        this.baseStationPoints = this.drawPoints(pointsList);
    }
    createAreaList(pointsList, radius = 0.2) {
        const layerId = Marker.getNewLayer('area-');
        const map = this.map;
        this.map.addSource(layerId, {
            type: 'geojson',
            data: {
                'type': 'FeatureCollection',
                'features': []
            }
        });
        const features = [];
        pointsList.forEach(point => {
            const f = this.createGeoJSONCircle(new lngLat_1.LngLat().setValue(point), radius);
            features.push(f);
        });
        map.getSource(layerId)
            .setData({
            'type': 'FeatureCollection',
            'features': features
        });
        map.addLayer({
            'id': layerId,
            'type': 'fill',
            'source': layerId,
            'layout': {},
            'paint': {
                'fill-color': '#ff0047',
                'fill-opacity': 0.1
            }
        });
        return {
            layerId,
            remove() {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                Marker.removeLayer(layerId);
                return this;
            },
            update(data) {
                map.getSource(layerId)
                    .setData(data);
                return this;
            }
        };
    }
    createGeoJSONCircle(center, radiusInKm, points = 64) {
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
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [ret]
            }
        };
    }
    drawPoints(pointsList) {
        const sourceData = this.getData(pointsList);
        const { map } = this;
        const layerId = Marker.getNewLayer();
        map.addSource(layerId, {
            type: 'geojson',
            data: sourceData
        });
        map.addLayer({
            id: layerId,
            type: 'circle',
            'paint': {
                'circle-color': {
                    'property': 'color',
                    'stops': [['#ff0000', '#ff0000']],
                    'type': 'categorical'
                },
                'circle-radius': 8
            },
            layout: {},
            source: layerId
        });
        return {
            layerId: layerId,
            points: pointsList,
            remove() {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                Marker.removeLayer(layerId);
            }
        };
    }
    getData(pointsList) {
        return {
            'type': 'FeatureCollection',
            'features': (() => {
                const features = [];
                pointsList.forEach((item, i) => {
                    const f = {
                        properties: {
                            color: '#ff0000',
                            point: item,
                            id: item.id,
                        },
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [item.lng, item.lat]
                        }
                    };
                    features.push(f);
                });
                return features;
            })()
        };
    }
    getBouds(pointsList) {
        const compareList = [];
        if (pointsList && 1 < pointsList.length) {
            let n = 1;
            for (let i = 0; i < pointsList.length - 1; i++) {
                for (let c = n; c < pointsList.length; c++) {
                    compareList.push([i, c]);
                }
                n++;
            }
            const pointWithDist = [];
            let max = 0;
            const lngLatMin = {
                lng: 0,
                lat: 0
            };
            const lngLatMax = {
                lng: 0,
                lat: 0
            };
            compareList.forEach(compare => {
                const p1 = pointsList[compare[0]], p2 = pointsList[compare[1]], dist = distance_1.distance([p1.lng, p1.lat], [p2.lng, p2.lat]);
                pointWithDist.push({
                    p1,
                    p2,
                    dist
                });
                const lngMin = p1.lng < p2.lng ? p1.lng : p2.lng;
                lngLatMin.lng = lngLatMin.lng || lngMin;
                if (lngMin < lngLatMin.lng) {
                    lngLatMin.lng = lngMin;
                }
                const latMin = p1.lat < p2.lat ? p1.lat : p2.lat;
                lngLatMin.lat = lngLatMin.lat || latMin;
                if (latMin < lngLatMin.lat) {
                    lngLatMin.lat = latMin;
                }
                const lngMax = p1.lng < p2.lng ? p2.lng : p1.lng;
                lngLatMax.lng = lngLatMax.lng || lngMax;
                if (lngLatMax.lng < lngMax) {
                    lngLatMax.lng = lngMax;
                }
                const latMax = p1.lat < p2.lat ? p2.lat : p1.lat;
                lngLatMax.lat = lngLatMax.lat || latMax;
                if (lngLatMax.lat < latMax) {
                    lngLatMax.lat = latMax;
                }
                if (max < dist) {
                    max = dist;
                }
            });
            return {
                max: max,
                bounds: [
                    {
                        lng: lngLatMin.lng,
                        lat: lngLatMin.lat
                    }, {
                        lng: lngLatMax.lng,
                        lat: lngLatMax.lat
                    }
                ]
            };
        }
        else {
            return {
                max: null,
                bounds: null
            };
        }
    }
    static removeLayer(layerId) {
        if (Marker.layerIds.has(layerId)) {
            Marker.layerIds.delete(layerId);
        }
    }
    static getNewLayer(prefix = 'marker-') {
        const min = 0, max = 5000000, int = true;
        let rand = min + Math.random() * (max - min);
        let layerId = '';
        if (int) {
            layerId = String(prefix).concat(Math.round(rand).toString());
        }
        if (Marker.layerIds.has(layerId)) {
            return Marker.getNewLayer();
        }
        Marker.layerIds.add(layerId);
        return layerId;
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