import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { Io } from './socket.oi.service';
import { LocalStorage } from './local-storage.service';
import { FriendsService } from './friends.service';
import { Marker } from '../util/marker';
import { DeviceLogData, MapGl } from '../../types/global';
import { LogData } from 'src/types/global';
import { LngLat } from 'src/app/util/lngLat';
import { DeviceIconComponent } from 'src/app/component/device-icon-component/device-icon-component';

//import { Marker } from './marker.service';


export interface DeviceData {
    id: string;
    name: string;
    image: string;
    phone: string,
    device_key: string;
}

export class Device implements DeviceData {
    id: string = null;
    user_id: number = null;
    device_key: string = null;
    name: string = null;
    phone: string = null;
    image: string = null;
    lngLat: LngLat;
    private marker: Marker = null;
    private iconEl: HTMLElement;


    constructor(
        d: DeviceData,
        private map: MapGl,
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        if (d) {
            [
                'id',
                'user_id',
                'device_key',
                'string',
                'phone',
                'image',
                'lng',
                'lat'
            ]
                .forEach(key => {
                    this[key] = d[key];
                });
        }




    }

    setIconEl(iconEl: HTMLElement) {

        return this;
    }

    onMarker(logData: LogData) {
        this.lngLat = new LngLat(logData.lng, logData.lat);
        if (!this.marker) {
            this.markerCreate(logData);
        } else {
            this.marker
                .setLngLat(this.lngLat);
        }
    }

    private markerCreate(logData: LogData) {
        this.marker = new Marker(
            this.map,
            this.injector,
            this.applicationRef,
            this.componentFactoryResolver)
            .setDevice(this)
            .setImage(this.image)
            .setLngLat(this.lngLat)
            .setDate(logData.date)
            .addToMap();

    }

    /*static create(map: MapGl): Device {
        return new Device(null, map);
    }*/
}


@Injectable()
export class DeviceService {

    private readonly devices: Array<Device> = [];
    private socket: any;
    public currentChildName: string;
    private map: MapGl;

    constructor(
        private io: Io,
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        this.socket = io.socket;
    }

    setMapGl(map): DeviceService {
        this.map = map;
        return this;
    }

    getDeviceList() {
        return this.devices;
    }

    getDeviceByDeviceKey(key: string): Device {
        const device = this.devices.find(item => item.device_key === key);
        if (!device) {
            const d = new Device(
                null,
                this.map,
                this.injector,
                this.applicationRef,
                this.componentFactoryResolver);
            d.device_key = key;
            this.devices.push(d);
        }
        return this.devices.find(item => item.device_key === key);
    }

    onDevices(): Promise<Array<Device>> {
        return this.socket.$get('onDevices', {})
            .then((d) => {
                if (d && d.result == 'ok') {
                    this.devices.length = 0;
                    d.devices.forEach(item => {
                        const device = new Device(
                            item,
                            this.map,
                            this.injector,
                            this.applicationRef,
                            this.componentFactoryResolver
                        );


                        this.devices.push(device);
                    });
                    return Promise.resolve(this.devices);

                } else {
                    return Promise.reject(d.error);
                }
            });
    }


    updateDevices() {
        return this.socket.$get('getDevices')
            .then(d => {
                if (d && d.result == 'ok') {
                    this.devices.length = 0;
                    d.devices.forEach(item => {
                        this.devices.push(item);
                    });

                } else {
                    return Promise.reject(d.error);
                }
                console.log(d);
                return this.devices;
            })
            .catch(err => {
                console.log(err);
            });
    }

    onAddDevice(device: Device): Promise<any> {
        return this.socket.$emit('onAddDevice', device)
            .then(d => {
                if (d && d.result == 'ok') {
                    this.updateDevices();
                }
                return d;
            });
    }

    onDelDevice(device: Device) {
        return this.socket.$emit('onDelDevice', device)
            .then(d => {
                if (d.result == 'ok') {
                    let index = this.devices.indexOf(device);
                    if (-1 < index) {
                        this.devices.splice(index, 1);
                    }
                }
                return d;
            });
    }

    clearDevices() {
        this.devices.length = 0;
    }

    onAddDeviceImage(device: Device) {
        return this.socket.$get('onAddDeviceImage', {
            deviceKey: device.device_key,
            image: device.image
        });
    }

    setCurrentChildName(name) {
        this.currentChildName = name;
    }


}
