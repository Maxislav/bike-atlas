import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {NavigationHistory} from "../../app.component";
import {Location} from '@angular/common';
import {PrivateAreaService, Area} from "../../service/private.area.service";




@Component({
    //noinspection TypeScriptUnresolvedVariable
    moduleId: module.id,
    templateUrl: './private-area.html',
    styleUrls: ['./private-area.css']
})
export class PrivateArea{

    private myArea: Area;

    constructor(
        private lh: NavigationHistory ,
        private location: Location,
        private router:Router,
        private areaService:PrivateAreaService

    ){
        this.areaService.onLoadMap
            .then(map=>{

            });



    }

    onDrawArea(){



        const click = (e)=>{
            console.log(e.lngLat);
            this.areaService.createArea([e.lngLat.lng, e.lngLat.lat])
        };
        this.areaService.onLoadMap
            .then(map=>{
                map.on('click', click)
            })


    }

    onClose(){
        if(this.lh.is){
            this.location.back()
        }else{
            this.router.navigate(['/auth/map']);
        }
    }



    ngOnDestroy(){

    }
}