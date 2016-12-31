import { Component } from '@angular/core';
import {Location} from '@angular/common';
import {Router} from "@angular/router";

@Component({
    moduleId: module.id,
    templateUrl:'device.component.html',
    styleUrls: [
        'device.component.css',
    ]
})
export class DeviceComponent{
    constructor(private location: Location, private router:Router){

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
