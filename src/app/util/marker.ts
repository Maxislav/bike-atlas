import { LngLat } from '../util/lngLat';
import { Device } from 'src/app/service/device.service';
import mapboxgl from '../../lib/mapbox-gl/mapbox-gl';
import { environment } from 'src/environments/environment';
import {ApplicationRef, ComponentFactoryResolver, ComponentRef, Injector} from '@angular/core';
import { DeviceIconComponent } from 'src/app/component/device-icon-component/device-icon-component';
import { BaseStation, LogData } from 'src/types/global';

export class Marker {
    static layerIds: Set<string> = new Set();
    private static color: string = 'rgba(129, 150, 253, 0.7)';
    layerId: string;
    id: string = null;
    alt: number = null;
    device: Device;
    name: string = null;
    azimuth: number;
    date: Date;
    lat: number;
    lng: number;
    speed: number;
    src: string;
    image: string;
    popupName: mapboxgl.Popup;
    batt: number;

    private iconMarker: any;
    private readonly deviceIconComponentEl: HTMLElement;
    private deviceIconComponentRef: ComponentRef<DeviceIconComponent>;

    private readonly tailLayerId: string;
    tailData: {
        type: 'FeatureCollection',
        features: Array<any>
    };
    tailLngLat: Array<LngLat> = [];

    private readonly basePointLayerId: string;
    private readonly basePointData: {
        type: 'FeatureCollection',
        features: Array<any>
    };

    private baseLineLayerId: string;
    private readonly baseLineData: {
        type: 'FeatureCollection',
        features: Array<any>
    };

    private accuracyLayerId: string;
    private readonly accuracyData: {
        type: 'FeatureCollection',
        features: Array<any>
    };

    constructor(
        private map,
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(DeviceIconComponent);
        this.deviceIconComponentEl = document.createElement('device-icon-component');
        this.deviceIconComponentRef = factory.create(this.injector, [], this.deviceIconComponentEl);
        this.applicationRef.attachView(this.deviceIconComponentRef.hostView);
        this.popupName = new mapboxgl.Popup({
            closeOnClick: false, offset: {
                'bottom': [0, -20],
            }, closeButton: false
        });

        this.tailLayerId = Marker.getNewLayer('tail-');


        this.tailData = {
            type: 'FeatureCollection',
            features: []
        };
        map.addSource(this.tailLayerId, {
            'type': 'geojson',
            'data': this.tailData,
        });
        map.addLayer({
            id: this.tailLayerId,
            source: this.tailLayerId,
            type: 'line',
            'paint': {
                'line-color': '#FF0000',
                'line-opacity': {
                    property: 'opacity',
                    stops: (() => {
                        const a = [];

                        for (let i = 0; i < 10; i++) {
                            a.push([i, i / 10]);
                        }
                        return a;
                    })(),
                },
                'line-width': 8
            },
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
        });

        this.basePointLayerId = Marker.getNewLayer('base-point-');
        this.basePointData = {
            type: 'FeatureCollection',
            features: []
        };
        map.addSource(this.basePointLayerId, {
            'type': 'geojson',
            'data': this.basePointData,
        });
        map.addLayer({
            id: this.basePointLayerId,
            source: this.basePointLayerId,
            type: 'circle',
            'paint': {
                'circle-color': {
                    'property': 'color',
                    'stops': [['superColor', Marker.color]],
                    'type': 'categorical'
                },
                'circle-radius': 8
            },
            layout: {},
        });

        this.baseLineLayerId = Marker.getNewLayer('base-line-');
        this.baseLineData = {
            type: 'FeatureCollection',
            features: []
        };
        map.addSource(this.baseLineLayerId, {
            'type': 'geojson',
            'data': this.baseLineData,
        });
        map.addLayer({
            id: this.baseLineLayerId,
            source: this.baseLineLayerId,
            type: 'line',
            'paint': {
                'line-color':Marker.color,
                'line-width': 2
            },

        });

        this.accuracyLayerId = Marker.getNewLayer('accuracy-area-');
        this.accuracyData = {
            type: 'FeatureCollection',
            features: []
        };

        map.addSource(this.accuracyLayerId, {
            'type': 'geojson',
            'data': this.accuracyData,
        });

        map.addLayer({
            id: this.accuracyLayerId,
            source: this.accuracyLayerId,
            type: 'line',
            'paint': {
                'line-color':Marker.color,
                'line-width': 2
            },

        });



    }



    updateLodData(logData: LogData): this {
        this.setLngLat(new LngLat(logData.lng, logData.lat))
            .setDate(logData.date)
            .setSpeed(logData.speed)
            .setBatt(logData.batt)
        this.tailLngLat.push(new LngLat(logData.lng, logData.lat));
        if (1 < this.tailLngLat.length) {
            this.tailUpdate();
        }
        return this;
    }

    /** 1*/
    setDevice(device: Device): this {
        this.device = device;
        this.setName(device.name);
        return this;
    }

    /** 2 */
    setImage(urlData: string): this {
        this.deviceIconComponentRef.instance.src = urlData || `${environment.hostPrefix}img/speedway_4_logo.jpg`;
        this.iconMarker = new mapboxgl.Marker(this.deviceIconComponentEl, {offset: [0, 0]});
        return this;
    }

    /** 3 */
    setName(name: string): this {
        if (name) {
            this.name = name;
            this.deviceIconComponentRef.instance.name = this.name;
            this.popupNameUpdate(name);
        }
        return this;
    }

    /** 4 */
    setLogData(logData: LogData): this {
        this.setLngLat(new LngLat(logData.lng, logData.lat))
            .setDate(logData.date)
            .setSpeed(logData.speed)
            .setBatt(logData.batt)

        if (logData.type === 'BS') {
            const center = new LngLat(logData.lng, logData.lat);
            this.baseStationCreate(center, logData.bs);
            this.createAccuracy(center, logData.accuracy/1000);
        }

        this.tailLngLat.push(new LngLat(logData.lng, logData.lat));

        return this;
    }

    /** 5 */
    addToMap(): this {
        this.iconMarker.addTo(this.map);
        this.popupName.addTo(this.map);
        return this;
    }


    setDate(date: string): this {
        this.date = new Date(date);
        return this;
    }

    setSpeed(speed: number): this {
        this.speed = speed;
        return this;
    }

    setBatt(batt: number): this {
        this.batt = Number(batt);
        return this;
    }
    remove() {
        this.iconMarker.remove();
        this.popupName.remove();
        this.map.removeLayer(this.tailLayerId);
        this.map.removeLayer(this.baseLineLayerId);
        this.map.removeLayer(this.basePointLayerId);
        this.map.removeLayer(this.accuracyLayerId);
    }

    setIconColor(color: string): this {
        this.deviceIconComponentRef.instance.colorSubject.next(color);
        return this;
    }

    private createAccuracy(center: LngLat, radius: number, points: number = 64){
        const coords = {
            latitude: center[1],
            longitude: center[0]
        };

        const km = radius;

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

        const feature = {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [ret]
            }
        };

        this.accuracyData.features = [feature];
        this.map
            .getSource(this.accuracyLayerId)
            .setData(this.accuracyData);

    }

    private baseStationCreate(lngLat: LngLat, bs: Array<BaseStation>) {
        this.basePointData.features = bs.map(baseStation => {
            return {
                properties: {
                    color: 'superColor',
                },
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [baseStation.lng, baseStation.lat]
                }
            };
        });
        this.map
            .getSource(this.basePointLayerId)
            .setData(this.basePointData);


        this.baseLineData.features = bs.map(baseStation => {
            return {
                properties: {
                    color: 'superColor',
                },
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [lngLat.toArray(),[baseStation.lng, baseStation.lat]]
                }
            };
        });
        this.map
            .getSource(this.baseLineLayerId)
            .setData(this.baseLineData);

    }

    private popupNameUpdate(name: string): this {
        this.popupName.setHTML('<div>' + name + '</div>');
        return this;
    }

    private setLngLat(lngLat: LngLat): this {
        this.lng = lngLat.lng;
        this.lat = lngLat.lat;
        this.iconMarker.setLngLat([this.lng, this.lat]);
        this.popupName.setLngLat([this.lng, this.lat]);
        return this;
    }
    private featureCreate(item: { opacity: number }, lngLat1: LngLat, lngLat2: LngLat) {
        return {
            properties: {
                opacity: item.opacity,
                point: item,
            },
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': [lngLat1.toArray(), lngLat2.toArray()]
            }
        };
    }

    private tailUpdate() {
        const arr = [];
        while (10 < this.tailLngLat.length) {
            this.tailLngLat.splice(0, 1);
        }

        const start = 10 - this.tailLngLat.length;
        for (let i = 0; i < this.tailLngLat.length - 1; i++) {
            arr.push(this.featureCreate({opacity: i + 1}, this.tailLngLat[i], this.tailLngLat[i + 1]));
        }
        this.tailData.features = arr;

        this.map.getSource(this.tailLayerId).setData(this.tailData);
    }

    static removeLayer(layerId: string) {
        if (Marker.layerIds.has(layerId)) {
            Marker.layerIds.delete(layerId);
        }
    }

    static getNewLayer(prefix: string = 'marker-'): string {
        const min = 0, max = 5000000, int = true;
        let rand = min + Math.random() * (max - min);
        let layerId: string = '';
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
