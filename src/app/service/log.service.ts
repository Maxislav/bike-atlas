import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {DeviceService} from "./device.service";
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
            this.devices[deviceData.id].maker.setCenter(deviceData);

        }else{
            let device = this.ds.devices.find(item=>{
                return item.id == deviceData.id
            });
            deviceData.name = device.name;
            this.devices[deviceData.id] = {
                id: deviceData.id,
                name: device ? device.name : null,
                maker: this.markerService.marker(deviceData)
            }
        }
    }
}

