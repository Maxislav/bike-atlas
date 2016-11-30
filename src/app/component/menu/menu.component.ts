/**
 * Created by maxislav on 22.11.16.
 */
import { Component} from '@angular/core';

import {MenuTrackComponent} from './menu-track/menu-track.component'

import any = jasmine.any;
import {MenuService} from "app/service/menu.service";
import {LoadTrack} from "./menu-track/load/load";
import {Track} from "../../service/track";
//import {Track} from "./track";

declare var document: any;



@Component({
    moduleId: module.id,
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    providers: [MenuTrackComponent, MenuService, LoadTrack , Track]
})
export class MenuComponent{

    public menuOpen: boolean;

    constructor(private ms: MenuService){
        //this.menuOpen = ms.menuOpen
    }
    onOpen(){
        var click =  onclick.bind(this);
        
        
        this.ms.menuOpen = !this.ms.menuOpen;
        if(this.ms.menuOpen ){
            setTimeout(()=>{
                document.body.addEventListener('click',click)
            },100)
        }else{
            document.body.removeEventListener('click', click)
        }

        function onclick(e){
            document.body.removeEventListener('click', click);
            this.ms.menuOpen = false
        }

    }

    //menuOpen: this.ms.menuOpe
}
