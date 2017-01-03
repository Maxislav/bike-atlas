/**
 * Created by maxislav on 10.10.16.
 */
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import {Mercator} from "../../service/mercator.service";
import {MapService} from "../../service/map.service";
import {PositionSize} from "../../service/position-size.service";
import {InfoPositionComponent} from "../info-position/info-position-component";
import {MenuComponent} from "../menu/menu.component";
import {AuthService} from "../../service/auth.service";
import {LogService} from "../../service/log.service";
//noinspection TypeScriptCheckImport


@Component({
    moduleId: module.id,
    templateUrl:'auth.component.html',
    //providers: [Mercator, MapService, InfoPositionComponent, PositionSize, MenuComponent],
    providers: [Mercator, InfoPositionComponent, PositionSize, MenuComponent],
    styleUrls: [
        'auth.component.css',
    ]
})

export class AuthComponent{

    constructor(public as: AuthService, private ls: LogService){
        this.as = as;
    }

}
