/**
 * Created by maxislav on 10.10.16.
 */
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import {LeafletMapDirective} from "./directive/leaflet-map.directive";
import {Mercator} from "./mercator.service";
import {MapService} from "./map.service";
import {PositionSize} from "./service/position-size.service";
import {InfoPositionComponent} from "./info-position-component";
import {MenuComponent} from "./component/menu.component";



@Component({
    templateUrl:'template/auth.component.html',
    providers: [Mercator, MapService, InfoPositionComponent, PositionSize,MenuComponent]
})

export class AuthComponent{
    constructor(el: ElementRef){
       // console.log(el)
    }
}
