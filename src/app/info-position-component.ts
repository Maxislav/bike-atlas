/**
 * Created by maxislav on 20.10.16.
 */

import { Component} from '@angular/core';
import {MapService} from "./map.service";

import {Mercator} from "./mercator.service";


@Component({
    selector:'info-position',
    template:'<div>lat: {{mapService.lat}}</div>' +
    '<div>Pixel: {{pixelY}}</div>',
    styles:[`:host{
        position: absolute;
        z-index: 2;
        bottom:0;
        left:0;
    }`]
})
export class InfoPositionComponent{
    private mercator: Mercator;
    pixelY: number;
    pixelX: number;
    mapService: MapService;

    constructor(mercator: Mercator, mapService: MapService){
        this.mercator = mercator;
        this.mapService = mapService;
        mapService.registerChanges(this.changes)
    }

    changes = (lat: number, lng: number, zoom: number)=>{
        this.pixelY = this.mercator.getYpixel(lat, zoom);
        this.pixelX = this.mercator.getYpixel(lng, zoom);
    }
}