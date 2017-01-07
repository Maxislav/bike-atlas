import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {DeviceService, Device} from "./device.service";
import {MarkerService, Marker} from "./marker.service";
//import {MarkerService} from "./marker.service";

export interface DeviceData{
    id: string;
    alt: number;
    name: string;
    azimuth: number;
    date: string;
    lat: number,
    lng: number,
    speed: number,
    image: string,
    src: string
}



@Injectable()
export class LogService{
    private socket: any;
    private devices: {};//Object<DeviceService>
    constructor(io: Io, private ds: DeviceService, private markerService: MarkerService){
        this.socket = io.socket;
        this.socket.on('log',this.log.bind(this));
        this.devices = {};
    }
    log(deviceData: DeviceData){
        console.log(deviceData);
        if( this.devices[deviceData.id] ){
            this.devices[deviceData.id].update(deviceData);
        }else{
            let device : Device = this.ds.devices.find(item=>{
                return item.id == deviceData.id
            });
            deviceData.name = device.name;
            deviceData.image = device.image;
            device.marker =  this.devices[deviceData.id] = this.markerService.marker(deviceData)
        }
    }
    clearDevices(){
        for(let opt in this.devices){
            this.devices[opt].hide();
            delete this.devices[opt];
        }
    }
    getDeviceData(id: string) : DeviceData{
        if(this.devices[id]){
            return this.devices[id].deviceData
        }
        return null;
    }



}

