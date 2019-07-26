import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {DeviceService} from "./device.service";
import {MarkerService, Marker} from "./marker.service";
import {UserService} from "./main.user.service";
import {deepCopy} from "../util/deep-copy";
import { Device, User } from '../../@types/global';
//import {MarkerService} from "./marker.service";

export interface DeviceData {
    id:string;
    alt:number;
    name:string;
    azimuth:number;
    date:string;
    lat:number,
    lng:number,
    speed:number,
    src:string;
    image?:string,
    device_key?:string;
    ownerId?:number;
    type: 'POINT' | 'BS'
}


@Injectable()
export class LogService {
    private socket:any;
    private readonly devices:{};//Object<DeviceService>
    constructor(io:Io, private user:UserService, private markerService:MarkerService) {
        this.socket = io.socket;
        this.socket.on('log', this.log.bind(this));
        this.devices = {};

        const a = {
            a: 1,
            b: 3
        }

    }

    log(devData:DeviceData) {
        console.log('log -> ', devData);
        if (!devData) return;
        let user: any;
        let device: Device = this.getDevice(this.user.user, devData);
        if (device) {
            user = this.user.user
        }

        if (!device) {
            let i = 0;
            while (i < this.user.friends.length) {
                device = this.getDevice(this.user.friends[i], devData);
                if (device) {
                    user = this.user.friends[i];
                    break;
                }
                i++;
            }
        }

        if (!device) {
            device = this.getDevice(this.user.other, devData);
        }

        if (!device) {
            device = this.user.createDeviceOther({
                device_key: devData.device_key,
                name: devData.name,
                ownerId: devData.ownerId
            });
            this.getOtherImage(devData.ownerId);
            user = {
                id: null,
                name: devData.name,
                image: null
            }
        }

       // console.log(device);

        if (device && !device.marker) {
            devData.name = device.name;
            device.marker = this.markerService.marker(devData, user);
            if(this.devices[device.device_key]){
                this.devices[device.device_key].marker.remove();
            }
            this.devices[device.device_key] = device;
        } else if (device && device.marker) {
            device.marker.update(devData)
        }



    }

    private getDevice(user:User, devData:DeviceData): Device {
        if (!devData) return null;
        if (!user.devices) {
            return null;
        }
        const devices = user.devices;
        return devices.find(item => {
            return item.device_key == devData.device_key
        });
    }

    clearDevices() {

    }

    setOtherImage(ownerId, image) {
        const device = this.user.other.devices.find(dev=> {
            return dev.ownerId == ownerId
        });
        if (device && device.marker) {
            device.marker.updateSetImage(image)
        }
    }

    getOtherImage(id) {
        this.user.getUserImageById(id)
            .then(image=>{
                this.setOtherImage(id, image)
            });

    }

    getLastPosition() {
        this.socket.$emit('getLastPosition')
            .then(rows => {
                this.clearDevices();
                rows.forEach(deviceData=> {
                    this.log(deviceData);
                });
            })
    }

    getDeviceData(id:string):DeviceData {
        if (this.devices[id]) {
            return this.devices[id].deviceData
        }
        return null;
    }

}

