import { Component , Input} from '@angular/core';
import {Mercator} from './mercator.service'
import {LeafletMapDirective} from "./directive/leaflet-map.directive";
import {HeroService} from "./hero.service";
import {MapService} from "./map.service";
import {InfoPositionComponent} from "./info-position-component";

@Component({
    
    template: '<info-position>' +
    '</info-position>' +
    '<leaflet-map> map loading...</leaflet-map>',
    styleUrls: ['src/app/css/leaflet-map.component.css'],
    directives: [LeafletMapDirective],
    providers: [HeroService]
})
export class MapComponent {


    constructor(mercator: Mercator, mapService: MapService){

    }






}