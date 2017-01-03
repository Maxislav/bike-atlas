import { Component } from '@angular/core';
import {Location} from '@angular/common';
import {Router} from "@angular/router";
import {DeviceService, Device} from "../../service/device.service";


@Component({
    moduleId: module.id,
    templateUrl:'device.component.html',
    styleUrls: [
        'device.component.css',
    ]
})
export class DeviceComponent{

    private device: Device;

    constructor(private location: Location, private router:Router, private ds: DeviceService){
        this.device = {
            name: null,
            id: null
        }
    }
    onAdd(e){
        e.preventDefault();
        console.log(this.device)
        this.ds.onAddDevice(this.device)

    }

    onOk(e) {
        e.preventDefault();
        this.router.navigate(['/auth/map']);
    }
    onCancel(e) {
        e.preventDefault();
        this.router.navigate(['/auth/map']);
    }

}
