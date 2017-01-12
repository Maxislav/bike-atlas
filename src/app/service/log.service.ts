import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {DeviceService, Device} from "./device.service";
import {MarkerService, Marker} from "./marker.service";
import {UserService, User} from "./main.user.service";
//import {MarkerService} from "./marker.service";

export interface DeviceData {
    id: string;
    alt: number;
    name: string;
    azimuth: number;
    date: string;
    lat: number,
    lng: number,
    speed: number,
    image: string,
    device_key?: string
    src: string
}


@Injectable()
export class LogService {
    private socket: any;
    private devices: {};//Object<DeviceService>
    constructor(io: Io, private user: UserService, private markerService: MarkerService) {
        this.socket = io.socket;
        this.socket.on('log', this.log.bind(this));
        this.devices = {};
    }

    log(marker: Marker) {
        let user: User;
        let device: Device = this.getDevice(this.user.user, marker);
        if(device){
            user = this.user.user
        }

        if(!device){
            let i = 0;
            while (i<this.user.friends.length){
                device = this.getDevice(this.user.friends[i], marker);
                if(device) {
                    user = this.user.friends[i];
                    break;
                }
                i++;
            }
        }

        console.log(device);

        if(device && !device.marker){
            marker.name = device.name;
            device.marker = this.markerService.marker(marker, user)
        }else if(device && device.marker){
            device.marker.update(marker)
        }

       /* const device: Device = this.ds.devices.find(item => {
            return item.id == marker.id
        });
        
        if(!device) return;
        
        if(device.marker){
            
        }else{
            device.marker = this.markerService.marker(marker)
        }*/
        
        
        /*console.log(deviceData);
        if (this.devices[deviceData.id]) {
            this.devices[deviceData.id].update(deviceData);
        } else {
            let device: Device = this.ds.devices.find(item => {
                return item.id == deviceData.id
            });
            deviceData.name = device.name;
            deviceData.image = device.image;
            device.marker = this.devices[deviceData.id] = this.markerService.marker(deviceData)
        }*/
    }

    private getDevice(user: User, marker: Marker){
        if(!marker) return null;
        const devices =user.devices;
       return devices.find(item => {
            return item.device_key == marker.device_key
        });
    }

    clearDevices() {
        
    }

    getLastPosition() {
        this.socket.$emit('getLastPosition')
            .then(rows => {
                this.clearDevices();
                rows.forEach(deviceData=>{
                    this.log(deviceData);
                });
            })
    }

    getDeviceData(id: string): DeviceData {
        if (this.devices[id]) {
            return this.devices[id].deviceData
        }
        return null;
    }

}

