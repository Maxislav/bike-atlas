import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {NavigationHistory} from "../../app.component";
import {Location} from '@angular/common';
import {PrivateAreaService, Area} from "../../service/private.area.service";
import {UserService} from "../../service/main.user.service";
import {Setting} from "../../service/auth.service";
import {distance} from "../../util/distance";

@Component({
    //noinspection TypeScriptUnresolvedVariable
    moduleId: module.id,
    templateUrl: './private-area.html',
    styleUrls: ['./private-area.css']
})
export class PrivateArea{


    private myArea: Area;
    private areas: Array<Area>;
    private clickCount: number = 0;
    private map: any;
    private _lng:number;
    private _lat:number;
    private _rad:number;
    private setting: Setting;

    constructor(
        private lh: NavigationHistory ,
        private location: Location,
        private router:Router,
        private userService: UserService,
        private areaService:PrivateAreaService

    ){
        this.myArea = {
            layerId: null,
            lng: null,
            lat: null,
            radius: null,
            update: null,
            remove: null
        };
        
        this.areas = areaService.areas;
        this.setting = userService.user.setting;
        this.areaService.onLoadMap
            .then(map=>{
                this.map = map;
                this.areaService.showArea()
                
            });

    }
    saveLock(val){
        this.areaService.saveLock(val);
    }

    get lng():number {
        return this.myArea.lng ? parseFloat(this.myArea.lng.toFixed(5)) : null;
    }
    
    get lat():number {
        return this.myArea.lat ? parseFloat(this.myArea.lat.toFixed(5)) : null;
    }
    
    get rad():number {
        return this.myArea.radius ? parseFloat(this.myArea.radius.toFixed(5)) : null;
    }

    onDrawArea(){
        this.clickCount++;
        const move = (e)=>{

            const dist = distance([
                this.myArea.lng,
                this.myArea.lat,
            ],[
                e.lngLat.lng,
                e.lngLat.lat
            ]);

            this.myArea.update([ this.myArea.lng,  this.myArea.lat],this.myArea.radius = dist);
            
        };

        const click = (e)=>{
            if(this.clickCount==1){
                if(this.myArea.layerId){
                    this.myArea.remove();
                }
                this.myArea.lng = e.lngLat.lng;
                this.myArea.lat = e.lngLat.lat;
                this.myArea = this.areaService.createArea(this.myArea);
                this.map.on('mousemove', move);
                this.clickCount++;
            }else {
                this.map.off('mousemove', move);
                this.clickCount = 1;
                this.onFinish = ()=>{
                    this.map.off('click', click);
                    this.clickCount = 0;
                    this.onSave()
                }
            }

        };

        if(this.clickCount==1){
            this.areaService.onLoadMap
                .then(map=>{
                    map.on('click', click);

                })
        }
    }
    onFinish(){
        
    }

    onDel(area: Area){
        console.log(area)
        this.areaService.removeArea(area.id)
    }
    onOver(area: Area){
        this.map.panTo([area.lng, area.lat])
    }

    onSave(){
        if(this.myArea.layerId){
            console.log(this.myArea)
            this.areaService.onSave(this.myArea)
                .then(d=>{
                    if(d){

                        this.myArea.remove()
                        this.myArea = {
                            layerId: null,
                            lng: null,
                            lat: null,
                            radius: null,
                            update: null,
                            remove: null
                        }

                    }
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
        if(this.myArea.layerId){
            this.myArea.remove()
        }
        this.areaService.hideArea()
    }
}