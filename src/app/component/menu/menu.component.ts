/**
 * Created by maxislav on 22.11.16.
 */
import { Component} from '@angular/core';

import {MenuTrackComponent} from './menu-track/menu-track.component'

import any = jasmine.any;
import {MenuService} from "app/service/menu.service";
import {TrackService} from "../../service/track.service";
import {TrackList} from "./track-list/track-list.component";
import {AuthService} from "../../service/auth.service";
//import {Track} from "./track";

declare var document: any;



@Component({
    moduleId: module.id,
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    providers: [MenuTrackComponent, MenuService,   TrackList]
})
export class MenuComponent{

    public menuOpen: boolean;
    public userName: string;
    
    trackList: Array<any>;

    constructor(private ms: MenuService, track: TrackService, public as: AuthService){
        this.trackList = track.trackList;
        //this.userName = as.userName;
        //this.menuOpen = ms.menuOpen
    }
    onOpen(){
        this.ms.menuOpen = !this.ms.menuOpen;
    }
    onOpenLogin(){
        this.ms.menuOpenLogin = !this.ms.menuOpenLogin;
    }
}
