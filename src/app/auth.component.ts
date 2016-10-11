/**
 * Created by maxislav on 10.10.16.
 */
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import {LeafletMapDirective} from "./directive/leaflet-map.directive";



@Component({
    template: '<leaflet-map> map loading...</leaflet-map>',
    styleUrls: ['src/app/css/auth.component.css'],
    directives: [LeafletMapDirective]


})

export class AuthComponent{
    constructor(el: ElementRef){
       // console.log(el)
    }
}
