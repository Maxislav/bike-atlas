/**
 * Created by maxislav on 22.11.16.
 */
import { Component} from '@angular/core';

import {MenuTrackComponent} from './menu-track/menu-track.component'

import any = jasmine.any;
import {MenuService} from "app/service/menu.service";
import {LoadTrack} from "./menu-track/load/load";
import {TrackService} from "../../service/track.service";
import {TrackList} from "./track-list/track-list.component";
//import {Track} from "./track";

declare var document: any;



@Component({
    moduleId: module.id,
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    providers: [MenuTrackComponent, MenuService, LoadTrack ,  TrackList]
})
export class MenuComponent{
   /* get menuOpenLogin():boolean {
        return this._menuOpenLogin;
    }

    set menuOpenLogin(value:boolean) {
        this._menuOpenLogin = value;
    }*/

    public menuOpen: boolean;
    
    trackList: Array<any>;

    constructor(private ms: MenuService, track: TrackService){
        this.trackList = track.trackList
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
    onOpenLogin(){
        var click =  onclick.bind(this);

        this.ms.menuOpenLogin = !this.ms.menuOpenLogin;
        if(this.ms.menuOpenLogin ){
            setTimeout(()=>{
                document.body.addEventListener('click',click)
            },100)
        }else{
            document.body.removeEventListener('click', click)
        }

        function onclick(e){
            document.body.removeEventListener('click', click);
            this.ms.menuOpenLogin = false
        }
        
    }
    

    //menuOpen: this.ms.menuOpe
}
