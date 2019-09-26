import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { Io } from './socket.oi.service';
import { LocalStorage } from './local-storage.service';
import { FriendsService } from './friends.service';
import { Marker } from '../util/marker';
import { DeviceLogData, MapGl } from '../../types/global';
import { LogData } from 'src/types/global';
import { LngLat } from 'src/app/util/lngLat';
import { DeviceIconComponent } from 'src/app/component/device-icon-component/device-icon-component';
import { distance } from 'src/app/util/distance';

//import { Marker } from './marker.service';


class ColorSpeed {
    move: string = '#1E90FF';
    stop: string = '#7ddc74';
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
}

export class Device implements DeviceData {
    id: string = null;
    user_id: number = null;
    device_key: string = null;
    name: string = null;
    phone: string = null;
    image: string = null;
    lngLat: LngLat;
    speed: number = 0;
    private lngLatStr: string;
    private marker: Marker = null;
    private color: ColorSpeed;
    public date: Date;
    public elapseTime: number;
    private isMove = false;
    public background: string;
    private timerId;
    private dist: number = 0;

    constructor(
        deviceData: DeviceData,
        private map: MapGl,
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        this.color = new ColorSpeed();
        this.background = this.color.dead;
        this.timerId = setInterval(()=>{
            this.calcColorTime();
            this.elapseTime = new Date().getTime() - this.date.getTime();
            this.marker.setIconColor(this.background);
        }, 1000);

        if (deviceData) {
            [
                'id',
                'user_id',
                'device_key',
                'string',
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

    setIconEl(iconEl: HTMLElement) {

        return this;
    }

    onMarker(logData: LogData) {
        let difTime = Infinity;
        const date = new Date(logData.date);
        if(this.date){
            difTime = date.getTime() - this.date.getTime();
        }
        this.date = date;
        this.elapseTime = new Date().getTime() - this.date.getTime();
        const lngLat =  new LngLat(logData.lng, logData.lat);
        if(this.lngLat && this.lngLat.toString() !== lngLat.toString()){
            this.isMove = true;
            const dist = distance([this.lngLat.lng, this.lngLat.lat], [lngLat.lng, lngLat.lat]);
            this.speed = 3.6*1000*1000* dist/difTime;
        }
        this.lngLat = lngLat;
        this.calcColorTime();

        if (!this.marker) {
            this.markerCreate(logData);
        } else {
            this.marker.updateLodData(logData);
        }
        this.marker.setIconColor(this.background);
        if(!this.name && logData.name){
            this.name = logData.name;
            this.marker.setName(this.name)
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
            .setLodData(logData)
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
            const c = Math.round(255 * this.elapseTime / this.color.DEAD_TIME).toString(16);
            this.background = String('#FFFF').concat(c.length < 2 ? '0' + c : c);
        }
    }

    remove(): this {
        clearInterval(this.timerId);
        this.marker.remove();
        return this;
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
