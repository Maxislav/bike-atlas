import {Component} from "@angular/core";
import {Location} from '@angular/common';
@Component({
    moduleId: module.id,
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent{
    constructor(private location: Location){

    }
    onClose(){
        this.location.back()
    }
}
