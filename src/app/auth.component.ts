/**
 * Created by maxislav on 10.10.16.
 */
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import {LeafletMapDirective} from "./directive/leaflet-map.directive";
import {Mercator} from "./mercator.service";
import {MapService} from "./map.service";
import {InfoPositionComponent} from "./info-position-component";



@Component({
    template:  '<router-outlet></router-outlet>',
    providers: [Mercator, MapService, InfoPositionComponent]
})

export class AuthComponent{
    constructor(el: ElementRef){
       // console.log(el)
    }
}
