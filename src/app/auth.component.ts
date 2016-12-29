/**
 * Created by maxislav on 10.10.16.
 */
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import {Mercator} from "./service/mercator.service";
import {MapService} from "./service/map.service";
import {PositionSize} from "./service/position-size.service";
import {InfoPositionComponent} from "./component/info-position/info-position-component";
import {MenuComponent} from "./component/menu/menu.component";
import {LocalStorage} from "./service/local-storage.service";
//noinspection TypeScriptCheckImport


@Component({
    moduleId: module.id,
    templateUrl:'template/auth.component.html',
    providers: [Mercator, MapService, InfoPositionComponent, PositionSize, MenuComponent],
    styleUrls: [
        'css/auth.component.css',
    ]
})

export class AuthComponent{

    socket: any;
    constructor(el: ElementRef, private  ls : LocalStorage){
     console.log(ls.userKey)
    }
}
