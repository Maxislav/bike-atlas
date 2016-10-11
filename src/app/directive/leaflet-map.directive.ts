/**
 * Created by maxislav on 10.10.16.
 */

import { Component } from '@angular/core';
import { Directive, ElementRef, Input, Renderer } from '@angular/core';
import any = jasmine.any;

declare var L: any;

@Directive({
    selector: 'leaflet-map',
    
})
export class LeafletMapDirective {

    map: any;
    constructor(el: ElementRef, renderer: Renderer) {
        console.log(el.nativeElement.offsetHeight);
        //debugger

        setTimeout( () => {
            console.log(L.map);
            this.map = L.map(el.nativeElement).setView([51.505, -0.09], 13);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);

        },1);


        renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'gray');
    }
}
