/**
 * Created by maxislav on 22.11.16.
 */
import { Component} from '@angular/core';

import {MenuTrackComponent} from './menu-track/menu-track.component'

//import any = jasmine.any;
import {MenuService} from "../../service/menu.service";
import {TrackService} from "../../service/track.service";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {FriendsService} from "../../service/friends.service";
import { User, UserService } from '../../service/main.user.service';
import {ToastService} from "../toast/toast.component";
import {MapService} from "../../service/map.service";
import {ChatService} from "../../service/chat.service";
import {ngIfAnimation} from '../../animation/animation'

declare var document: any;
declare const System: any;



@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.less'],
    providers: [MenuTrackComponent, MenuService],
    animations: [ngIfAnimation]
})
export class MenuComponent{

    public menuOpen: boolean;
    public userName: string;
    public invites: Array<User> = [];
    public user: User;
    public weatherLayer: any;
    public unViewedIds: Array<number> = [];

    public isShowMenuAthlete: boolean = false;
    public isShowMenuTrack: boolean = false;


    constructor(public menuService:MenuService,
                private track:TrackService,
                private authService:AuthService,
                private router:Router,
                private friend:FriendsService,
                private userService:UserService,
                private mapService:MapService,
                private toast:ToastService,
                private chatService:ChatService,
                ) {

        this.user = this.userService.getUser();
        //this.invites = friend.invites;
        //this.unViewedIds = chatService.unViewedIds
    }

    onOpen(){
        this.menuService.menuOpen = !this.menuService.menuOpen;
    }
    onOpenTrackMenu(): void{
      this.isShowMenuTrack = true
    }

    onCloseMenuTrack(e): void{
        this.isShowMenuTrack = false
    }

    onOpenLogin(){
        this.menuService.menuOpenLogin = !this.menuService.menuOpenLogin;
    }

    onOpenAthlete(){
/*
        if(!this.user.name && !this.userService.other.devices.length){
            this.toast.show({
                type: 'warning',
                text: 'Нет онлайн пользователей'
            })
        }else {
            this.isShowMenuAthlete = true
        }
*/
    }


    onCloseMenuAthlete(e){
        this.isShowMenuAthlete = e
    }

    onWeather(){

        if(this.weatherLayer){
            this.weatherLayer.remove();
        }else{
            this.weatherLayer = this.addWeatherLayer();
        }
    }

    addWeatherLayer(){
        const map = this.mapService.map;
        map.addSource('borispol',{
            "type": "image",
            'url': System.baseURL+'borisbolukbb?date='+new Date().toISOString(),
            "coordinates" :[
                [27.9,52.14],
                [33.89,52.14],
                [33.89,48.35],
                [27.9,48.35]
            ]
        });
        map.addLayer({
            id:'borispol',
            source: 'borispol',
            "type": "raster",
            "paint": {"raster-opacity": 0.7}

        });
        return {
            remove: ()=>{
                map.removeLayer('borispol');
                map.removeSource('borispol');
                this.weatherLayer = null;
            }
        }
    }

    removeWeatherLayer(){

    }




    goToProfile(){
        this.router.navigate(['/auth/map/profile']);
       /* if(this.userService.user && this.userService.user.name){
            this.router.navigate(['/auth/map/profile']);
        }*/
    }
    goToFriends(){
        this.router.navigate(['/auth/map/friends']);
    }
}
