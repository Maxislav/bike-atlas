import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
    moduleId: module.id,
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent{
    constructor(private location: Location) {
    }
    onCancel(){
        this.location.back();
    }
    onOk(){
        this.location.back();
    }
}