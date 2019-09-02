import { Injectable } from '@angular/core';
import { Io } from './socket.oi.service';
import { LocalStorage } from './local-storage.service';
import { FriendsService } from './friends.service';
import { Marker } from './marker.service';




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
    private _marker: Marker = null;
    constructor(d: DeviceData) {
        if (d) {
            Object.keys(this).forEach(key => {
                this[key] = d[key];
            });
        }
    }

    setMarker(marker: Marker): this {
        this._marker = marker;
        return this;
    }

    get marker(): Marker {
        return this._marker;
    }


    static create(): Device {
        return new Device(null);
    }
}


@Injectable()
export class DeviceService {

    private readonly devices: Array<Device> = [];
    private socket: any;
    public currentChildName: string;

    constructor(private io: Io,
    ) {
        this.socket = io.socket;
        //this.devices = user.user.devices;

    }

    getDeviceList() {
        return this.devices;
    }

    getDeviceByDeviceKey(key: string): Device {
        return this.devices.find(item => item.device_key === key);
    }

    onDevices(): Promise<Array<Device>> {
        return this.socket.$get('onDevices', {})
            .then((d) => {
                if (d && d.result == 'ok') {
                    this.devices.length = 0;
                    d.devices.forEach(item => {
                        const device = new Device(item);
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
