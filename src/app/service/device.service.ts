import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector} from '@angular/core';
import {Io} from './socket.oi.service';
import {Marker} from '../util/marker';
import {MapGl} from '../../types/global';
import {LogData} from 'src/types/global';
import {LngLat} from 'src/app/util/lngLat';
import {distance} from 'src/app/util/distance';


class ColorSpeed {
    move: string = '#1E90FF';
    stop: string = '#06dc00';
    rest: string = '#ffff00';
    dead: string = '#FFFFFF';
    DEAD_TIME = 12 * 3600 * 1000;
    MOVE_TIME = 60 * 1000;

    //  background: string;

    constructor() {
        //    this.background = this.dead;
    }

}


export interface DeviceData {
    id: string;
    name: string;
    image: string;
    phone: string,
    device_key: string;
    sharedLink: string;
}

export class Device implements DeviceData {
    id: string = null;
    user_id: number = null;
    device_key: string = null;
    name: string = null;
    phone: string = null;
    image: string = null;
    sharedLink = null;
    lngLat: LngLat;
    speed: number = 0;
    marker: Marker = null;
    public background: string;
    public date: Date;
    public elapseTime: number;

    private color: ColorSpeed;
    private isMove = false;
    private timerId;


    constructor(
        deviceData: DeviceData,
        private map: MapGl,
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        this.color = new ColorSpeed();
        this.background = this.color.dead;

        if (deviceData) {

            [
                'id',
                'user_id',
                'device_key',
                'phone',
                'image',
                'lng',
                'lat',
                'name'
            ]
                .forEach(key => {
                    this[key] = deviceData[key];
                });
        }
    }

    private timerStart() {
        this.timerId = setInterval(() => {
            this.calcColorTime();
            this.elapseTime = new Date().getTime() - this.date.getTime();
            this.marker.setIconColor(this.background);
        }, 1000);
    }

    setIconEl(iconEl: HTMLElement) {
        return this;
    }

    onMarker(logData: LogData) {
        let difTime = Infinity;
        const date = new Date(logData.date);
        if (this.date) {
            difTime = date.getTime() - this.date.getTime();
        }
        if (!this.timerId) {
            this.timerStart();
        }
        this.date = date;
        this.elapseTime = new Date().getTime() - this.date.getTime();
        const lngLat = new LngLat(logData.lng, logData.lat);
        if (this.lngLat && this.lngLat.toString() !== lngLat.toString()) {
            this.isMove = true;
            const dist = distance([this.lngLat.lng, this.lngLat.lat], [lngLat.lng, lngLat.lat]);
            this.speed = 3.6 * 1000 * 1000 * dist / difTime;
        }
        this.lngLat = lngLat;
        this.calcColorTime();

        if (!this.marker) {
            this.markerCreate(logData);
        } else {
            this.marker.updateLodData(logData);
        }
        this.marker.setIconColor(this.background);
        if (!this.name && logData.name) {
            this.name = logData.name;
            this.marker.setName(this.name);
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
            .setName(this.name)
            .setLogData(logData)
            .addToMap();

    }

    private calcColorTime() {
        if (this.elapseTime < this.color.MOVE_TIME && this.isMove) {
            this.background = this.color.move;
        } else if (this.elapseTime < this.color.MOVE_TIME) {
            this.background = this.color.stop;
        } else if (this.color.DEAD_TIME < this.elapseTime) {
            this.background = this.color.dead;
        } else {
            this.background = this.getColor(this.elapseTime)
        }
    }

    private getColor(elapseTime: number): string {
        const colorSpeed = new ColorSpeed();
        let g = 'FF';
        let b = '00';
        const middleTime = colorSpeed.DEAD_TIME / 2;
        const quarter = colorSpeed.DEAD_TIME / 4;
        if (elapseTime < quarter) {
            g = (Math.round(127 * elapseTime / quarter) + 127).toString(16)
            g = g.length < 2 ? `0${g}` : g;
        } else {
            b = Math.round(255 * elapseTime / (quarter * 3)).toString(16);
            b = b.length < 2 ? `0${b}` : b;
        }
        return `#FF${g}${b}`;
    }

    remove(): this {
        clearInterval(this.timerId);
        this.marker && this.marker.remove();
        return this;
    }


    toJson() {
        const device = {};
        [
            'id',
            'user_id',
            'device_key',
            'phone',
            'image',
            'lng',
            'lat',
            'name'
        ].map(key => {
            device[key] = this[key];
        });
        return device;
    }

    /*static create(map: MapGl): Device {
        return new Device(null, map);
    }*/
}


@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    private readonly devices: Array<Device> = [];
    private socket: any;
    public currentChildName: string;
    private map: MapGl;

    constructor(
        private io: Io,
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
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

    onLocationUpdate(d: Device): Promise<any> {
        return this.socket.$get('update-location', {
            device_key: d.device_key
        })
    }

    getDeviceByDeviceKey(key: string): Device {
        const device = this.devices.find(item => item.device_key === key);
        if (!device) {
            const device: Device = this.createDevice(key);
            this.devices.push(device);
        }
        return this.devices.find(item => item.device_key === key);
    }


    createDevice(key: string = ''): Device {
        const d = new Device(
            null,
            this.map,
            this.injector,
            this.applicationRef,
            this.componentFactoryResolver);
        d.device_key = key;
        return d;
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


    updateDevices(): Promise<Array<Device>> {
        this.clearDevices();
        return this.onDevices()
    }

    onAddDevice(device: Device): Promise<any> {
        const dv = device.toJson();
        return this.socket.$get('onAddDevice', dv)
    }

    onDelDevice(device: Device) {
        const dv = device.toJson();

        return this.socket.$get('onDelDevice', dv)
            .then(d => {
                if (d.result == 'ok') {
                    let index = this.devices.indexOf(device);
                    if (-1 < index) {
                        this.devices[index].remove();
                        this.devices.splice(index, 1);
                    }
                }
                return d;
            });
    }

    clearDevices() {
        this.devices.forEach(d => {
            d.remove();
        });

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
