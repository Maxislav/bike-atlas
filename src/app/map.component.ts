import { Component , Input} from '@angular/core';
import {Mercator} from './service/mercator.service'
import {MapService} from "./service/map.service";
import {InfoPositionComponent} from "./component/info-position/info-position-component";
import {MapboxGlDirective, MapResolver} from "./directive/mapbox-gl.directive";
import {LogService} from "./service/log.service";
import { APP_INITIALIZER } from '@angular/core';
import {Resolve} from "@angular/router";
import {fadeInAnimation} from  './animation/animation'

//declare const module: any;

@Component({
    //moduleId: module.id,
    template:
        '<info-position>' +
        '</info-position>' +
        '<router-outlet></router-outlet>' +
        '<mapbox-gl> map loading...</mapbox-gl>'
    ,
    styleUrls: ['./css/map.component.less'],
    providers:[],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class MapComponent {


    constructor(mercator: Mercator, mapService: MapService, private ls: LogService){

    }


}