
import {Component} from "@angular/core";
import {DeviceService, Device} from "../../../service/device.service";
import {MapService} from "../../../service/map.service";
import {LogService} from "../../../service/log.service";
@Component({
    moduleId: module.id,
    selector: 'menu-athlete',
    templateUrl: './menu.athlete.component.html',
    styleUrls: ['./menu.athlete.component.css'],
    // providers: [MenuService]
})
export class MenuAthleteComponent{
    private devices: Array<Device>;
    constructor(private ds: DeviceService, private  mapServ: MapService, private ls: LogService){
        this.devices = ds.devices;
    }

    selectDevice(device){
       // console.log(device)
        const deviceData  = this.ls.getDeviceData(device.id)
        console.log(deviceData)
        if(deviceData){
            this.mapServ.map.flyTo({
                center: [deviceData.lng, deviceData.lat]
            })
        }
    }
}