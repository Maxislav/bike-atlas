import { Component , Input} from '@angular/core';
import {Mercator} from './service/mercator.service'
import {MapService} from "./service/map.service";
import {InfoPositionComponent} from "./component/info-position/info-position-component";
import {MapboxGlDirective} from "./directive/mapbox-gl.directive";
import {LogService} from "./service/log.service";

@Component({
    moduleId: module.id,
    template: [
        '<info-position>',
        '</info-position>',
        '<router-outlet></router-outlet>',
        '<mapbox-gl> map loading...</mapbox-gl>'
    ].join('') ,
    styleUrls: ['./css/map.component.css'],
})
export class MapComponent {


    constructor(mercator: Mercator, mapService: MapService, private ls: LogService){

    }






}