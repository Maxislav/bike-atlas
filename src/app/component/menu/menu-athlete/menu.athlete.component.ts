
import {Component} from "@angular/core";
import {DeviceService, Device} from "../../../service/device.service";
import {MapService} from "../../../service/map.service";
import {LogService} from "../../../service/log.service";
import {UserService} from "../../../service/main.user.service";
import {forEach} from "@angular/router/esm/src/utils/collection";

@Component({
    moduleId: module.id,
    selector: 'menu-athlete',
    templateUrl: './menu.athlete.component.html',
    styleUrls: ['./menu.athlete.component.css'],
})
export class MenuAthleteComponent{
   
    private userDevices: Array<Device>;
    private _friendDevices: Array<Device>;
    private otherDevices: Array<Device>;



    constructor(   private user: UserService, private mapService: MapService){
        this.userDevices = user.user.devices;
        this.otherDevices = user.other.devices;
    }

    selectDevice(device){
        if(device.marker){
            this.mapService.map.flyTo({
                center: [device.marker.lng, device.marker.lat]
            })
        }
    }

    get friendDevices():Array<Device> {
        const devices = [];
        
        this.user.friends.forEach(friend=>{
           friend.devices.forEach(dev=>{
               devices.push(dev)
           })
            
        });
        
        return devices;
    }

    ngOnDestroy(){
       /* if(this.interval){
            clearInterval(this.interval)
        }*/
    }
}