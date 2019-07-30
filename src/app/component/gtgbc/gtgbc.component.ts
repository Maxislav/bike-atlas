import { Component, OnDestroy, OnInit } from '@angular/core';
import { ngIfAnimation } from '../../animation/animation';
import { MapService } from '../../service/map.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GtgbcService } from '../../api/gtgbc.service';
import { MobileCell, MapArea as Area } from '../../../@types/global';
import { deepCopy } from '../../util/deep-copy';
import { distance } from '../../util/distance';
import { LngLat } from '../../util/lngLat';

enum MessageType {
    GTSTR,
    GTLBS,
    GTGSM
}
declare const module: any;
@Component({
    moduleId: module.id,
    templateUrl: './gtgbc.component.html',
    styleUrls: ['./gtgbc.component.css'],
    animations: [ngIfAnimation]
})
export class GtgbcComponent implements OnInit, OnDestroy {
    public gtgbc: string = null;
    public messageTypeString: string;

    private mcArr;
    private static layerIds: Array<String> = [];
    private layerId: string;
    private map;
    private areaList: Array<Area>;
    private centerPoints;
    private messageType: MessageType;


    constructor(
        private mapService: MapService,
        private router: Router,
        private route: ActivatedRoute,
        private gtgbcService: GtgbcService
    ) {
        this.areaList = [];
        this.layerId = this.getLayerId('mobile-cell-');
    }


    onClose() {
        this.router.navigate(['/auth', 'map']);
    }

    ngOnInit(): void {
        this.route.params
            .subscribe(params => {
                if (!params['gtgbc']) {
                    return;
                }
                this.gtgbc = params['gtgbc'];
                const type: MessageType = this.messageType = this.getType(this.gtgbc);
                if (type === MessageType.GTLBS ||type === MessageType.GTGSM) {
                    const arr: Array<MobileCell> = this.convertToMobileCell();
                    this.clearData();
                    this.gtgbcService.getLatLng(arr)
                        .then(pointsList => {
                            this.createStations(pointsList);
                        })
                        .catch(e => {
                            console.error(e);
                        });
                }else if(type === MessageType.GTSTR){
                    this.clearData();
                    const lngLat  = this.convertToLngLat(this.gtgbc)
                    this.createStations([lngLat]);
                }
            });
    }

    private getType(str: string): MessageType | null {
        switch (true) {
            case !str: {
                return null;
            }
            case typeof str !== 'string': {
                return null;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTSTR,\d+,\d+,.+/): {
                this.messageTypeString = 'GTSTR';
                return MessageType.GTSTR;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTLBS,\d+,\d+,.+/): {
                this.messageTypeString = 'GTLBS';
                return MessageType.GTLBS;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTGSM,\d+,\d+,.+/): {
                this.messageTypeString = 'GTGSM';
                return MessageType.GTGSM;
            }
            default: {
                return null;
            }
        }
    }


    private createStations(pointsList: Array<{ lng: number, lat: number }>): void {
        const {layerId} = this;
        this.mapService.onLoad
            .then(map => {

                this.map = map;

                const {bounds, max} = this.getBouds(pointsList);
                if (bounds) {
                    map.fitBounds([[bounds[0].lng, bounds[0].lat], [bounds[1].lng, bounds[1].lat]], {
                        padding: {top: 100, bottom: 100, left: 100, right: 100}
                    });
                } else {
                    this.map.panTo([pointsList[0].lng, pointsList[0].lat]);
                }


                pointsList.forEach((point: Area) => {
                    this.areaList.push(this.createArea(Object.assign({}, {...point}, {radius: max})));
                });
                this.drawPoints(pointsList);
            });
    }

    private drawPoints(pointsList: Array<{ lng: number, lat: number }>) {
        const sourceData = this.getData(pointsList);
        const {map, layerId} = this;
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

    private getBouds(pointsList: Array<{ lng: number, lat: number }>): { max: number, bounds: Array<{ lng: number, lat: number }> } {


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
                const p1 = pointsList[compare[0]], p2 = pointsList[compare[1]],
                    dist = distance([p1.lng, p1.lat], [p2.lng, p2.lat]);
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
        } else {
            return {
                max: null,
                bounds: null
            };
        }


    }

    private createArea(area: Area): Area {
        const layerId = this.getLayerId('mobile-cell-');
        const radius = area.radius || 0.2;
        const map = this.map;

        this.map.addSource(layerId,
            {
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

        function createGeoJSONCircle(center, radiusInKm, points: number = 64) {

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
        };


        return {
            id: area.id || null,
            layerId: layerId,
            lng: area.lng,
            lat: area.lat,
            radius: radius,
            update: function ([lng, lat], r?: number) {
                this.lng = lng;
                this.lat = lat;
                map.getSource(layerId)
                    .setData(createGeoJSONCircle([lng, lat], r));
                return this;
            },
            remove: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                return this;
            }
        };
    }


    private getData(pointsList) {
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

    private convertToLngLat(str: string): LngLat{
        const arr = this.gtgbc.split(',');
        arr.splice(0, 12);
        return new LngLat(Number(arr[1]), Number(arr[2]))

    }
    private convertToMobileCell(): Array<MobileCell> {
        const mc = {
            mcc: null,
            mnc: null,
            lac: null,
            cellId: null
        };
        const arr = this.gtgbc.split(',');
        if(this.messageType === MessageType.GTLBS){
            arr.splice(0, 12);
        }
        if(this.messageType === MessageType.GTGSM){
            arr.splice(0, 4);
        }

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

    private transformToView(): string {
        const arr = this.gtgbc ? this.gtgbc.split(',') : [];
        return this.cut(arr);
    }

    private cut(charArr: Array<string>, i: number = 1, str: string = ''): string {
        if (charArr.length) {
            let _str = charArr.slice(0, i).join(',');
            if (_str.length < 60 && i < charArr.length) {
                return this.cut(charArr, ++i, str);
            } else {
                charArr.splice(0, i);
                str = str.concat(str.length ? ', ' + _str : _str);
                if (charArr.length) {
                    return this.cut(charArr, 1, str);
                } else {
                    return str;
                }
            }
        }
        return str;
    }

    private getLayerId(prefix?: String) {
        prefix = prefix || '';
        const min = 0, max = 10000;

        const rand = prefix + Math.round(min + Math.random() * (max - min)).toLocaleString();

        if (-1 < GtgbcComponent.layerIds.indexOf(rand)) {
            return this.getLayerId(prefix);
        } else {
            GtgbcComponent.layerIds.push(rand);
            return rand;
        }
    }

    private clearData() {
        this.centerPoints && this.centerPoints.remove();
        this.areaList && this.areaList.forEach(area => {
            area && area.remove();
        });
        this.areaList.length = 0;
    }

    ngOnDestroy(): void {
        this.clearData();

    }
}
