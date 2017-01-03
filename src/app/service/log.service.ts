import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {DeviceService} from "./device.service";
import {MarkerService, Marker} from "./marker.service";
//import {MarkerService} from "./marker.service";

export interface DeviceMarker{
    id: string,
    name: string,
    marker: Marker
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
    log(d){
      console.log(d)

        if( this.devices[d.device_key] ){
            this.devices[d.device_key].maker.setCenter({
                lng: parseFloat(d.lng),
                lat: parseFloat(d.lat),
                bearing: parseFloat(d.azimuth)
            })
        }else{
            let device = this.ds.devices.find(item=>{
                return item.id == d.device_key
            });
            console.log(device)
            this.devices[d.device_key] = {
                id: d.device_key,
                name: device ? device.name : null,
                maker: this.markerService.marker({
                    lng: parseFloat(d.lng),
                    lat: parseFloat(d.lat),
                    bearing: parseFloat(d.azimuth)
                }, device ? device.name : null)
            }
        }
        //his.devices[d.device_key] = this.devices[d.device_key] ||
    }
}

