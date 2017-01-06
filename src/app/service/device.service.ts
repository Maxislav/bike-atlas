import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {LocalStorage} from "./local-storage.service";
import {Marker} from "./marker.service";

export interface Device {
    id: string;
    name: string;
    phone?: string,
    marker?: Marker;
    passed?: string;
}


@Injectable()
export class DeviceService {

    private _devices: Array<Device>;
    private socket: any;

    constructor(private io: Io, private ls: LocalStorage) {
        this.socket = io.socket;
        this._devices = [];
    }

    updateDevices() {
        const hash = this.ls.userKey;
        this.socket.$emit('getDevice', {hash})
            .then(d => {
                if (d && d.result == 'ok') {
                    this.devices = d.devices
                }
                console.log(d)
            })
            .catch(err => {
                console.log(err)
            })
    }

    onAddDevice(device: Device) {
        return new Promise((resolve, reject) => {
            this.socket.$emit('onAddDevice', device)
                .then(d => {
                    if (d && d.result == 'ok') {
                        this.updateDevices();
                        resolve(d)
                    }
                    reject()
                })
        })
    }
    onDelDevice(device: Device){
       return this.socket.$emit('onDelDevice', device)
    }
    clearDevice(){
        this._devices.length = 0;
    }

    get devices(): Array<Device> {
        return this._devices;
    }

    set devices(devices: Array<Device>) {
        this._devices.length = 0;
        devices.forEach(device => {
            this._devices.push(device)
        });
    }

}
