import { Component , Input} from '@angular/core';
import {Mercator} from './mercator.service'
import {HeroService} from "./hero.service";
import {MapService} from "./map.service";
import {InfoPositionComponent} from "./info-position-component";
import {MapboxGlDirective} from "./directive/mapbox-gl.directive";

@Component({
    moduleId: module.id,
    template: [
        '<info-position>',
        '</info-position>',
        '<mapbox-gl> map loading...</mapbox-gl>'].join('') ,
    styleUrls: ['css/map.component.css'],
    directives: [MapboxGlDirective],
    providers: [HeroService]
})
export class MapComponent {


    constructor(mercator: Mercator, mapService: MapService){

    }






}