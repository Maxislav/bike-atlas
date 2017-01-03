

import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";

export interface Device{

    id: string;
    name: string;
    phone?: string
}

@Injectable()
export class DeviceService{

    private _devices: Array<Device>;
    private socket: any;
    constructor(private io: Io){
        this.socket = io.socket;
        this._devices = [];
    }

    updateDevices(hash){
        this.socket.$emit('getDevice', {hash})
            .then(d=>{
                console.log(d)
            })
            .catch(err=>{
                console.log(err)
            })
    }

    onAddDevice(device: Device){
        this.socket.$emit('onAddDevice', device)
            .then(d=>{
                console.log(d)
            })
    }

    get devices(): Array<Device> {
        return this._devices;
    }

    set devices(devices: Array<Device>) {
        this._devices.length = 0;
        devices.forEach(device=>{
            this._devices.push(device)
        });
    }

}
