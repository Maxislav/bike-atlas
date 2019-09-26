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
import { LogData } from 'src/types/global';

export class Marker {

    static layerIds: Set<string>;
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

    private iconMarker: any;
    private deviceIconComponentEl: HTMLElement;
    private deviceIconComponentRef: ComponentRef<DeviceIconComponent>;

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

    }

    setLogData(logData: LogData): this {
        this.setLngLat(new LngLat(logData.lng, logData.lat))
            .setDate(logData.date)
            .setSpeed(logData.speed);
        if(logData.name){
            this.setName(logData.name)
        }
        return this;
    }

    updateLodData(logData: LogData): this {
        this.setLngLat(new LngLat(logData.lng, logData.lat))
            .setDate(logData.date)
            .setSpeed(logData.speed);
        return this;
    }


    setDevice(device: Device): this {
        this.device = device;
        this.setName(device.name);
        return this;
    }

    private setName(name: string): this {
        this.name = name;
        this.deviceIconComponentRef.instance.name = this.name;
        return this;
    }


    addToMap(): this {
        this.iconMarker.addTo(this.map);
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
    }

    setIconColor(color: string): this{
        this.deviceIconComponentRef.instance.colorSubject.next(color);
        return this;
    }

    private setLngLat(lngLat: LngLat): this {
        this.lng = lngLat.lng;
        this.lat = lngLat.lat;
        this.iconMarker.setLngLat([this.lng, this.lat]);
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