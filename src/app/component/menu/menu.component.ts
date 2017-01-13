/**
 * Created by maxislav on 22.11.16.
 */
import { Component} from '@angular/core';

import {MenuTrackComponent} from './menu-track/menu-track.component'

//import any = jasmine.any;
import {MenuService} from "app/service/menu.service";
import {TrackService} from "../../service/track.service";
import {TrackList} from "./track-list/track-list.component";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {FriendsService} from "../../service/friends.service";
import {UserService, User} from "../../service/main.user.service";
import {ToastService} from "../toast/toast.component";
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
    private invites: Array<User>
    trackList: Array<any>;
    private user: User;

    constructor(
        private ms: MenuService,
        track: TrackService,
        public as: AuthService,
        private router: Router,
        private friend: FriendsService,
        private userService: UserService,
    private toast: ToastService)

    {
        this.user = userService.user;
        this.invites = friend.invites;
        this.trackList = track.trackList;

    }
    onOpen(){
        this.ms.menuOpen = !this.ms.menuOpen;
    }
    onOpenLogin(){
        this.ms.menuOpenLogin = !this.ms.menuOpenLogin;
    }
    onOpenAthlete(){
        if(this.user.name || this.userService.other.devices.length){
            this.ms.menuAthlete = !this.ms.menuAthlete;
        }else {
            this.toast.show({
                type: 'warning',
                text: 'Вы не вошли в системы'
            })
        }


    }
    goToProfile(){
        if(this.as.userName){
            this.router.navigate(['/auth/map/profile']);
        }
    }
    goToFriends(){
        this.router.navigate(['/auth/map/friends']);
    }
}
