/**
 * Created by maxislav on 20.10.16.
 */

import { Component, ApplicationRef} from '@angular/core';
import {MapService} from "../../service/map.service";
import {Mercator} from "../../service/mercator.service";

@Component({
    selector:'info-position',
    //template:'<div>lat: {{mapService.lat}}</div>' + '<div>Pixel: {{pixelY}}</div>',
    templateUrl:'app/component/info-position/info-position-component.html',
    styleUrls:['app/component/info-position/info-position.css']
})
export class InfoPositionComponent{
    private mercator: Mercator;
    pixelY: number;
    pixelX: number;
    mapService: MapService;

    constructor(mercator: Mercator, mapService: MapService){
        this.mercator = mercator;
        this.mapService = mapService;
        mapService.registerChanges(this.changes);
    }
    


    changes = (lat: number, lng: number, zoom: number)=>{
        this.mapService.latMap = lat;
        this.mapService.lngMap = lng;
        //console.log(lat, lng)
       // this.pixelY = this.mercator.getYpixel(lat, zoom);
        //this.pixelX = this.mercator.getYpixel(lng, zoom);
    }
}