import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { TimerService, Timer } from './timer.service';
import { elapsedStatus } from '../util/elapsed-status';
import { Point } from './track.var';
import { TailClass } from './tail.class';
import { distance } from '../util/distance';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { MapBoxGl, MapGl, MapMarker, Popup, User, DeviceData } from '../../@types/global';
import { MapArea as Area } from '../interface/MapArea';


export class Marker {

    id: string;
    alt: number;
    name: string;
    azimuth: number;
    date: string;
    lat: number;
    lng: number;
    speed: number;
    src: string;
    image: string;
    tail: TailClass;
    speedSubject: Observable<number>;
    type: 'POINT' | 'BS';


    private speedBehaviorSubject: BehaviorSubject<number>;
    static layerIds: Set<string> = new Set();
    private layerId: string;
    private icoContainer: HTMLElement;
    private popup: Popup;
    private iconMarker: MapMarker;
    private elapsed: string;
    private status: string = 'white';
    private intervalUpdateMarker: number;
    private timer: Timer;
    private img: any;

    private areaList: Array<Area> = [];

    private baseStationLayerId: string;

    private baseStationPoints: {layerId: string, points: Array<{ lng: number, lat: number }>, remove: ()=>void};


    //TODO creating and update user marker
    constructor(devData: DeviceData, private user: User, private mapboxgl: MapBoxGl, private map: MapGl, private timerService: TimerService) {

        console.log  (devData.type)
        Object.keys(devData).forEach(key => {
            this[key] = devData[key];
        });
        this.speedBehaviorSubject = new BehaviorSubject<number>(0);
        this.speedSubject = this.speedBehaviorSubject.asObservable();
        this.timer = new Timer(devData.date);
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

        this.iconMarker = new mapboxgl.Marker(icoContainer, {offset: [0, 0]})
            .setLngLat([devData.lng, devData.lat])
            .addTo(map);

        this.image = user.image || 'src/img/no-avatar.gif';

        this.elapsed = '...';

        this.tail = new TailClass(this.layerId, this.map);

        this.intervalUpdateMarker = setInterval(() => {
            this.updateMarker();
        }, 1000);

        if(devData.type === 'BS'){
            this.map.onLoad
                .then(m => {
                    this.createStations(devData.bs)
                })
        }

    }

    update(devData: DeviceData): Marker {
        const prevLngLat: Point = new Point(this.lng, this.lat);
        const t = this.timer.tick(devData.date);
        for (let opt in devData) {
            this[opt] = devData[opt];
        }
        const nextLngLat: Point = new Point(this.lng, this.lat);
        this.speed = 3600 * 1000 * distance(prevLngLat, nextLngLat) / t; //km/h
        this.speedBehaviorSubject.next(this.speed);
        this.popup.setLngLat([this.lng, this.lat]);
        this.status = elapsedStatus(this);
        this.iconMarker.setLngLat([this.lng, this.lat]);
        this.icoContainer.setAttribute('status', this.status);
        this.tail.update(new Point(devData.lng, devData.lat));


        if(this.baseStationPoints){
            this.baseStationPoints.remove()
        }
        this.areaList.forEach(area => {
            area.remove();
        });
        this.areaList = [];

        if(devData.type === 'BS'){
            this.createStations(devData.bs)
        }


        return this;
    }

    updateMarker(): Marker {

        this.status = elapsedStatus(this);
        this.icoContainer.setAttribute('status', this.status);
        this.elapsed = this.timerService.elapse(this.date);
        return this;
    }

    remove(): void {
        this.popup.remove();
        this.iconMarker.remove();
        this.intervalUpdateMarker && clearInterval(this.intervalUpdateMarker);
    };

    updateSetImage(src) {
        this.img.src = src;
        this.image = src;
    }


    private createStations(pointsList: Array<{ lng: number, lat: number }>): void {
       // this.baseStationLayerId = Marker.getNewLayer();
        const {bounds, max} = this.getBouds(pointsList);


        pointsList.forEach((point: Area) => {
            this.areaList.push(this.createArea(Object.assign({}, {...point}, {radius: max})));
        });
        this.drawPoints(pointsList);
    }



    private createArea(area: Area): Area {
        const layerId = Marker.getNewLayer();// this.getLayerId('mobile-cell-');
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
            },
            remove: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
            }
        };
    }

    private drawPoints(pointsList: Array<{ lng: number, lat: number }>) {
        const sourceData = this.getData(pointsList);
        const {map} = this;

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


        this.baseStationPoints = {
            layerId: layerId,
            points: pointsList,
            remove() {
                map.removeLayer(layerId);
                map.removeSource(layerId);
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

    static getNewLayer(): string {
        const min = 0, max = 5000000, int  = true;
        let rand = min + Math.random() * (max - min);
        let layerId: string = '';
        if (int) {
            layerId = String('marker-').concat(Math.round(rand).toString());
        }
        if (Marker.layerIds.has(layerId)) {
            return Marker.getNewLayer();
        }
        Marker.layerIds.add(layerId);
        return layerId;
    }
}

@Injectable()
export class MarkerService {
    constructor(private mapService: MapService, private timer: TimerService) {
    }

    marker(devData: DeviceData, user: User): Marker {
        return new Marker(devData, user, this.mapService.mapboxgl, this.mapService.map, this.timer);
    }
}
