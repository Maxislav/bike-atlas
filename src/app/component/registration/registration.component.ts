import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {Md5} from "../../service/md5.service";

@Component({
    moduleId: module.id,
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent{
    private _pass1: string;
    constructor(private location: Location, private md5: Md5) {
    }
    onCancel(){
        this.location.back();
    }
    onOk(){
        this.location.back();
    }

    set pass1(val){
        this._pass1 = this.md5.hash(val)
    }
}