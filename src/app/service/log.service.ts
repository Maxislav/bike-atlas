import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {DeviceService, Device} from "./device.service";
import {MarkerService, Marker} from "./marker.service";
import {UserService} from "./main.user.service";
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

        let device: Device = this.user.user.devices.find(item => {
            return item.device_key == marker.device_key
        });
        if(device){
            marker.image = this.user.user.image
        }

        if(!device){
            this.user.friends.forEach(friend=>{
                let image = '';

                device = friend.devices.find(item=>{
                        return item.device_key == marker.device_key
                    })
                if(device){
                    marker.image = friend.image
                }
            })
        }

        console.log(device)

        if(device && !device.marker){
            marker.name = device.name;
            device.marker = this.markerService.marker(marker)
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

    clearDevices() {
        for (let opt in this.devices) {
            this.devices[opt].hide();
            delete this.devices[opt];
        }
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

