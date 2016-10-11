/**
 * Created by maxislav on 10.10.16.
 */
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';



@Component({
    template: '<leaflet-map> map loading...</leaflet-map>',
    //styleUrls: ['src/app/css/leaflet-map.component.css'],
    styles: ['{width: 100%}']


})

export class AuthComponent{
    constructor(el: ElementRef){
       // console.log(el)
    }
}
