import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {NavigationHistory} from "../../app.component";
import {Location} from '@angular/common';



@Component({
    //noinspection TypeScriptUnresolvedVariable
    moduleId: module.id,
    templateUrl: './private-area.html',
    styleUrls: ['./private-area.css']
})
export class PrivateArea{

    constructor( private lh: NavigationHistory , private location: Location,private router:Router){

    }

    onClose(){
        if(this.lh.is){
            this.location.back()
        }else{
            this.router.navigate(['/auth/map']);
        }
    }
}