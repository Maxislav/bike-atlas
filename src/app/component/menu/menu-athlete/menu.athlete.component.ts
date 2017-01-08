
import {Component} from "@angular/core";
import {DeviceService, Device} from "../../../service/device.service";
import {MapService} from "../../../service/map.service";
import {LogService} from "../../../service/log.service";

@Component({
    moduleId: module.id,
    selector: 'menu-athlete',
    templateUrl: './menu.athlete.component.html',
    styleUrls: ['./menu.athlete.component.css'],
})
export class MenuAthleteComponent{
    private devices: Array<Device>;
    private interval: number;
    private passed: Array<number>;


    constructor(private ds: DeviceService,
                private  mapServ: MapService,
                private ls: LogService
               ){

        this.devices = ds.devices;
    }

    selectDevice(device){
        const deviceData  = this.ls.getDeviceData(device.id)
        console.log(deviceData);
        if(deviceData){
            this.mapServ.map.flyTo({
                center: [deviceData.lng, deviceData.lat]
            })
        }
    }

    ngOnDestroy(){
       /* if(this.interval){
            clearInterval(this.interval)
        }*/
    }
}