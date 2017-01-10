import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {NavigationHistory} from "../../app.component";
import {Location} from '@angular/common';
import {PrivateAreaService, Area} from "../../service/private.area.service";
import {Distance} from "../../service/distance";




@Component({
    //noinspection TypeScriptUnresolvedVariable
    moduleId: module.id,
    templateUrl: './private-area.html',
    providers: [Distance],
    styleUrls: ['./private-area.css']
})
export class PrivateArea{

    private myArea: Area;
    private clickCount: number = 0;
    private map: any

    constructor(
        private lh: NavigationHistory ,
        private location: Location,
        private router:Router,
        private distance: Distance,
        private areaService:PrivateAreaService

    ){
        this.areaService.onLoadMap
            .then(map=>{
                this.map = map
            });



    }

    onDrawArea(){

        this.clickCount++;

        const move = (e)=>{
            //console.log(e.lngLat)

            const dist = this.distance.distance([
                this.myArea.lng,
                this.myArea.lat,
            ],[
                e.lngLat.lng,
                e.lngLat.lat
            ]);

            this.myArea.update([ this.myArea.lng,  this.myArea.lat], dist);
            
        };

        const click = (e)=>{
            if(this.clickCount==1){
                if(this.myArea){
                    this.myArea.remove();
                }
                this.myArea = this.areaService.createArea([e.lngLat.lng, e.lngLat.lat]);
                this.map.on('mousemove', move);
                this.clickCount++;
            }else {
                console.log('dsd');
                this.map.off('mousemove', move);
                this.clickCount = 1
            }

        };

        if(this.clickCount==1){
            this.areaService.onLoadMap
                .then(map=>{
                    map.on('click', click)
                })
        }
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