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
var GtgbcComponent_1;
const core_1 = require("@angular/core");
const animation_1 = require("../../animation/animation");
const map_service_1 = require("../../service/map.service");
const router_1 = require("@angular/router");
const gtgbc_service_1 = require("../../api/gtgbc.service");
const distance_1 = require("../../util/distance");
const lngLat_1 = require("../../util/lngLat");
var MessageType;
(function (MessageType) {
    MessageType[MessageType["GTSTR"] = 0] = "GTSTR";
    MessageType[MessageType["GTLBS"] = 1] = "GTLBS";
})(MessageType || (MessageType = {}));
let GtgbcComponent = GtgbcComponent_1 = class GtgbcComponent {
    //public gtgbcViewModel: string = null;
    constructor(mapService, router, route, gtgbcService) {
        this.mapService = mapService;
        this.router = router;
        this.route = route;
        this.gtgbcService = gtgbcService;
        this.gtgbc = null;
        this.areaList = [];
        this.layerId = this.getLayerId('mobile-cell-');
    }
    onClose() {
        this.router.navigate(['/auth', 'map']);
    }
    ngOnInit() {
        this.route.params
            .subscribe(params => {
            if (!params['gtgbc']) {
                return;
            }
            this.gtgbc = params['gtgbc'];
            const type = this.getType(this.gtgbc);
            if (type === MessageType.GTLBS) {
                const arr = this.convertToMobileCell();
                this.clearData();
                this.gtgbcService.getLatLng(arr)
                    .then(pointsList => {
                    this.createStations(pointsList);
                })
                    .catch(e => {
                    console.error(e);
                });
            }
            else if (type === MessageType.GTSTR) {
                this.clearData();
                const lngLat = this.convertToLngLat(this.gtgbc);
                this.createStations([lngLat]);
            }
        });
    }
    getType(str) {
        switch (true) {
            case !str: {
                return null;
            }
            case typeof str !== 'string': {
                return null;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTSTR,\d+,\d+,.+/): {
                return MessageType.GTSTR;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTLBS,\d+,\d+,.+/): {
                return MessageType.GTLBS;
            }
            default: {
                return null;
            }
        }
    }
    createStations(pointsList) {
        const { layerId } = this;
        this.mapService.onLoad
            .then(map => {
            this.map = map;
            const { bounds, max } = this.getBouds(pointsList);
            if (bounds) {
                map.fitBounds([[bounds[0].lng, bounds[0].lat], [bounds[1].lng, bounds[1].lat]], {
                    padding: { top: 100, bottom: 100, left: 100, right: 100 }
                });
            }
            else {
                this.map.panTo([pointsList[0].lng, pointsList[0].lat]);
            }
            pointsList.forEach((point) => {
                this.areaList.push(this.createArea(Object.assign({}, Object.assign({}, point), { radius: max })));
            });
            this.drawPoints(pointsList);
        });
    }
    drawPoints(pointsList) {
        const sourceData = this.getData(pointsList);
        const { map, layerId } = this;
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
        this.centerPoints = {
            points: pointsList,
            remove() {
                map.removeLayer(layerId);
                map.removeSource(layerId);
            }
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
    createArea(area) {
        const layerId = this.getLayerId('mobile-cell-');
        const radius = area.radius || 0.2;
        const map = this.map;
        this.map.addSource(layerId, {
            type: 'geojson',
            data: createGeoJSONCircle([area.lng, area.lat], radius)
        });
        this.map.addLayer({
            'id': layerId,
            'type': 'fill',
            'source': layerId,
            'layout': {},
            'paint': {
                'fill-color': '#ff0047',
                'fill-opacity': 0.1
            }
        });
        function createGeoJSONCircle(center, radiusInKm, points = 64) {
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
                'type': 'FeatureCollection',
                'features': [{
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Polygon',
                            'coordinates': [ret]
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
    gtgbcOnChange() {
    }
    onApplyClick() {
        this.router.navigate(['/auth', 'map', 'gtgbc', this.gtgbc]);
    }
    convertToLngLat(str) {
        const arr = this.gtgbc.split(',');
        arr.splice(0, 12);
        return new lngLat_1.LngLat(Number(arr[1]), Number(arr[2]));
    }
    convertToMobileCell() {
        const mc = {
            mcc: null,
            mnc: null,
            lac: null,
            cellId: null
        };
        const arr = this.gtgbc.split(',');
        arr.splice(0, 12);
        const res = [];
        while (arr.length) {
            res.push(arr.splice(0, 6));
        }
        return res.filter(item => 6 <= item.length).map(item => {
            return {
                mcc: parseInt(item[0], 10),
                mnc: parseInt(item[1], 10),
                lac: parseInt(item[2], 16),
                cellId: parseInt(item[3], 16)
            };
        });
    }
    transformToView() {
        const arr = this.gtgbc ? this.gtgbc.split(',') : [];
        return this.cut(arr);
    }
    cut(charArr, i = 1, str = '') {
        if (charArr.length) {
            let _str = charArr.slice(0, i).join(',');
            if (_str.length < 60 && i < charArr.length) {
                return this.cut(charArr, ++i, str);
            }
            else {
                charArr.splice(0, i);
                str = str.concat(str.length ? ', ' + _str : _str);
                if (charArr.length) {
                    return this.cut(charArr, 1, str);
                }
                else {
                    return str;
                }
            }
        }
        return str;
    }
    getLayerId(prefix) {
        prefix = prefix || '';
        const min = 0, max = 10000;
        const rand = prefix + Math.round(min + Math.random() * (max - min)).toLocaleString();
        if (-1 < GtgbcComponent_1.layerIds.indexOf(rand)) {
            return this.getLayerId(prefix);
        }
        else {
            GtgbcComponent_1.layerIds.push(rand);
            return rand;
        }
    }
    clearData() {
        this.centerPoints && this.centerPoints.remove();
        this.areaList && this.areaList.forEach(area => {
            area && area.remove();
        });
        this.areaList.length = 0;
    }
    ngOnDestroy() {
        this.clearData();
    }
};
GtgbcComponent.layerIds = [];
GtgbcComponent = GtgbcComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: './gtgbc.component.html',
        styleUrls: ['./gtgbc.component.css'],
        animations: [animation_1.ngIfAnimation]
    }),
    __metadata("design:paramtypes", [map_service_1.MapService,
        router_1.Router,
        router_1.ActivatedRoute,
        gtgbc_service_1.GtgbcService])
], GtgbcComponent);
exports.GtgbcComponent = GtgbcComponent;
//# sourceMappingURL=gtgbc.component.js.map