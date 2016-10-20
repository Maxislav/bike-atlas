/**
 * Created by maxislav on 10.10.16.
 */

import { Component } from '@angular/core';
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import any = jasmine.any;
import {MapService} from "../map.service";

declare var L: any;

@Directive({
    selector: 'leaflet-map',
})
export class LeafletMapDirective {

    map: any;
    constructor(el: ElementRef, renderer: Renderer, mapSevice: MapService) {
       // console.log(el.nativeElement.offsetHeight);
        el.nativeElement.innerHTML = '';
        //el.html('')
        
        setTimeout( () => {
            el.nativeElement.innerHTML = '';
            console.log(L.map);
            this.map = L.map(el.nativeElement).setView([50.5, 30.5], 8);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
            mapSevice.setMap(this.map);

        },1);


        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'gray');
    }
}
