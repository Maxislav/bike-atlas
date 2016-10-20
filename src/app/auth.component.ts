/**
 * Created by maxislav on 10.10.16.
 */
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import {LeafletMapDirective} from "./directive/leaflet-map.directive";
import {Mercator} from "./mercator.service";



@Component({
    
    //template: '<leaflet-map> map loading...</leaflet-map>',
    template:  '<router-outlet></router-outlet>',
    //styleUrls: ['src/app/css/auth.component.css'],
    //directives: [LeafletMapDirective]
    providers: [Mercator]


})

export class AuthComponent{
    constructor(el: ElementRef){
       // console.log(el)
    }
}
