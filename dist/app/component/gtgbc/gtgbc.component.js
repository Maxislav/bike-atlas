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
let GtgbcComponent = GtgbcComponent_1 = class GtgbcComponent {
    //public gtgbcViewModel: string = null;
    constructor(mapService, router, route, gtgbcService) {
        this.mapService = mapService;
        this.router = router;
        this.route = route;
        this.gtgbcService = gtgbcService;
        this.gtgbc = null;
    }
    onClose() {
        this.router.navigate(['/auth', 'map']);
    }
    ngOnInit() {
        this.route.params
            .subscribe(params => {
            this.gtgbc = params['gtgbc'];
            const arr = this.convertToMobileCell();
            console.log('param: -> ', this.gtgbc);
            this.gtgbcService.getLatLng(arr)
                .then(pointsList => {
                this.drawPoints(pointsList);
            })
                .catch(e => {
                console.error(e);
            });
        });
    }
    drawPoints(pointsList) {
        console.log(pointsList);
        const layerId = this.getLayerId('mobile-cell-');
        this.mapService.onLoad
            .then(map => {
            map.addSource(layerId, {
                type: "geojson",
                data: sourceData
            });
            map.addLayer({
                id: layerId,
                type: "circle",
                "paint": {
                    "circle-color": {
                        "property": "color",
                        "stops": [['#ff0000', '#ff0000']],
                        "type": "categorical"
                    },
                    "circle-radius": 8
                },
                layout: {},
                source: layerId
            });
        });
        const sourceData = this.getData(pointsList);
    }
    getData(pointsList) {
        return {
            "type": "FeatureCollection",
            "features": (() => {
                const features = [];
                pointsList.forEach((item, i) => {
                    const f = {
                        properties: {
                            color: '#ff0000',
                            point: item,
                            id: item.id,
                        },
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [item.lng, item.lat]
                        }
                    };
                    features.push(f);
                });
                return features;
            })()
        };
    }
    //+RESP:GTLBS,440503,866427030059602,GL520,0,0,100,0,2,,,0000,0255,0001,0715,487d,30,,0255,0001,0715,1402,23,,0255,0001,0715,487b,22,,0255,0001,0715,4fa7,13,,025$
    get gtgbcViewModel() {
        if (!this.gtgbc) {
            return null;
        }
        return this.transformToView();
    }
    gtgbcOnChange() {
    }
    onApplyClick() {
        this.router.navigate(['/auth', 'map', 'gtgbc', this.gtgbc]);
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