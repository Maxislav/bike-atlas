/**
 * Created by maxislav on 10.10.16.
 */
import { Component } from '@angular/core';
import {Mercator} from "../../service/mercator.service";
import {PositionSize} from "../../service/position-size.service";
import {InfoPositionComponent} from "../info-position/info-position-component";
import {MenuComponent} from "../menu/menu.component";
import {AuthService} from "../../service/auth.service";


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

    constructor(public as: AuthService ){
        this.as = as;
    }

}
