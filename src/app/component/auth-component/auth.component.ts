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
import {LocalStorage} from "../../service/local-storage.service";
import {Io} from "../../service/socket.oi.service";
//noinspection TypeScriptCheckImport


@Component({
    moduleId: module.id,
    templateUrl:'auth.component.html',
    providers: [Mercator, MapService, InfoPositionComponent, PositionSize, MenuComponent],
    styleUrls: [
        'auth.component.css',
    ]
})

export class AuthComponent{

    socket: any;
    private _userName: string;
    constructor(el: ElementRef, private  ls : LocalStorage, private io: Io){
     console.log(ls.userKey)
        this.socket = io.socket;
        this.socket.on('connect', this.onConnect.bind(this))


    }

    onConnect(){
        this.socket.$emit('onAuth', {
            hash: this.ls.userKey
        }).then(d=>{
            console.log(d)
        })

    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }


}
