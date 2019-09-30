import { User } from '../service/main.user.service';
import { LngLat } from '../util/lngLat';
import { Device } from 'src/app/service/device.service';
import * as mapboxgl from '../../lib/mapbox-gl/mapbox-gl.js';
import { environment } from 'src/environments/environment';
import { ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { DeviceIconComponent } from 'src/app/component/device-icon-component/device-icon-component';
import { ComponentRef } from '@angular/core/src/linker/component_factory';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { LogData, Popup } from 'src/types/global';

export class Marker {

    static layerIds: Set<string> = new Set();
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
    popupName: Popup;

    private iconMarker: any;
    private deviceIconComponentEl: HTMLElement;
    private deviceIconComponentRef: ComponentRef<DeviceIconComponent>;

    private tailLayerId: string;
    tailData: any;
    tailLngLat: Array<LngLat> = [];

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
            "type": "geojson",
            "data": this.tailData,
        });
        map.addLayer({
            id:   this.tailLayerId,
            source: this.tailLayerId,
            type: 'line',
            "paint": {
                "line-color": '#FF0000',
                "line-opacity": {
                    property: 'opacity',
                    stops: (()=>{
                       const a = [];

                       for(let i = 0; i<10; i++){
                           a.push([i, i/10])
                       }
                       return a
                    })(),
                },
                "line-width": 8
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
        })

    }

    private featureCreate(item: {opacity: number}, lngLat1: LngLat, lngLat2: LngLat){
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

/*
            'type': 'LineString',
            'coordinates': [[center.lng, center.lat], [station.lng, station.lat]]*/
        }
    }

    private tailUpdate(){
        const arr = [];
        while (10 < this.tailLngLat.length) {
            this.tailLngLat.splice(0,1);
        }

        const start = 10 -  this.tailLngLat.length;
        for(let i = 0 ; i <this.tailLngLat.length-1; i++){
            arr.push(this.featureCreate({opacity: i+1}, this.tailLngLat[i], this.tailLngLat[i+1]))
        }
        this.tailData .features = arr;

        this.map.getSource(this.tailLayerId).setData(this.tailData)
    }

    setLodData(logData: LogData): this {
        this.setLngLat(new LngLat(logData.lng, logData.lat))
            .setDate(logData.date)
            .setSpeed(logData.speed);
        this.tailLngLat.push(new LngLat(logData.lng, logData.lat));

        return this;
    }

    updateLodData(logData: LogData): this {
        this.setLngLat(new LngLat(logData.lng, logData.lat))
            .setDate(logData.date)
            .setSpeed(logData.speed);
        this.tailLngLat.push(new LngLat(logData.lng, logData.lat));
        if(1<this.tailLngLat.length){
            this.tailUpdate()
        }
        return this;
    }


    setDevice(device: Device): this {
        this.device = device;
        this.setName(device.name);
        return this;
    }

    private popupNameUpdate(name: string): this{
        this.popupName.setHTML('<div>' + name + '</div>');
        return this;
    }


    setName(name: string): this {
        if(name){
            this.name = name;
            this.deviceIconComponentRef.instance.name = this.name;
            this.popupNameUpdate(name);
        }
        return this;
    }


    addToMap(): this {
        this.iconMarker.addTo(this.map);
        this.popupName.addTo(this.map)
        return this;
    }


    setImage(urlData: string): this {
        this.deviceIconComponentRef.instance.src = urlData || `${environment.hostPrefix}img/speedway_4_logo.jpg`;
        this.iconMarker = new mapboxgl.Marker(this.deviceIconComponentEl, {offset: [0, 0]});
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

    remove() {
        this.iconMarker.remove();
        this.popupName.remove();
        this.map.removeLayer(this.tailLayerId)
    }

    setIconColor(color: string): this{
        this.deviceIconComponentRef.instance.colorSubject.next(color);
        return this;
    }

    private setLngLat(lngLat: LngLat): this {
        this.lng = lngLat.lng;
        this.lat = lngLat.lat;
        this.iconMarker.setLngLat([this.lng, this.lat]);
        this.popupName.setLngLat([this.lng, this.lat]);
        return this;
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