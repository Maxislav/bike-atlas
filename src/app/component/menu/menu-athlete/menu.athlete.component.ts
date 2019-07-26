
import {Component, EventEmitter, Output} from "@angular/core";
import {DeviceService} from "../../../service/device.service";
import {MapService} from "../../../service/map.service";
import {LogService} from "../../../service/log.service";
import {UserService} from "../../../service/main.user.service";
import {fromEvent} from 'rxjs/observable/fromEvent'
import { Device } from '../../../../@types/global';



declare const module: any;

@Component({
    moduleId: module.id,
    selector: 'menu-athlete',
    templateUrl: './menu.athlete.component.html',
    styleUrls: ['./menu.athlete.component.css'],
})
export class MenuAthleteComponent{
    private userDevices: Array<Device>;
    private otherDevices: Array<Device>;


    @Output() onCloseMenuAthlete:EventEmitter<boolean> = new EventEmitter()

    constructor(   private user: UserService, private mapService: MapService){
        this.userDevices = user.user.devices;
        this.otherDevices = user.other.devices;
        this.onCloseMenu = this.onCloseMenu.bind(this, false)

    }


    onCloseMenu(){
        this.onCloseMenuAthlete.emit(false)
    }

    ngOnInit(){
    }

    ngAfterViewInit(){
        setTimeout(()=>{
            document.addEventListener('click', this.onCloseMenu)
        }, 10)
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
        document.removeEventListener('click', this.onCloseMenu)
    }
}