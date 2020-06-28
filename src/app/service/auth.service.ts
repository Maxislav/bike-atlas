import { Injectable } from '@angular/core';
import { Io } from './socket.oi.service';
import { LocalStorage } from './local-storage.service';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FriendsService } from '../api/friends.service';
import { Setting, UserService } from './main.user.service';
import { ChatService } from './chat.service';
import { Deferred } from '../util/deferred';
import { MyMarkerService } from '../service/my-marker.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { autobind } from '../util/autobind';
import { DeviceService } from './device.service';
import { LogService } from './log.service';
import { MapService } from 'src/app/service/map.service';
import { MapGl } from 'src/types/global';
import {ToastService} from '../shared-module/toast-module/toast.service';


@Injectable()
export class AuthService implements CanActivate {
    socket: any;
    private _userId: number;
    private _userName: string = null;
    private _userImage: string = null;
    public can: Subject<boolean> = new Subject();

    constructor(
        private io: Io,
        private ls: LocalStorage,
        private friend: FriendsService,
        public userService: UserService,
        public friendsService: FriendsService,
        private chatService: ChatService,
        private toast: ToastService,
        private myMarkerService: MyMarkerService,
        private  deviceService: DeviceService,
        private logService: LogService,
        private router: Router,
        private mapService: MapService
    ) {
        this.socket = io.socket;
        this.socket.on('connect', this.onConnect);
        this.socket.on('disconnect', this.onDisconnect);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.can;
    }

    onEnter({name, pass}) {
        return this.socket
            .$get('onEnter', {
                name: name,
                pass: pass
            })
            .then(this.setHashName);
    }

    @autobind()
    private setHashName(d) {
        console.log(d);
        switch (d.result) {
            case 'ok':
                this.ls.userKey = d.hash;
                this.onAuth();
                break;
            case false:
                this.toast.show({
                    type: 'warning',
                    text: 'Невеное имя пользователя или пароль'
                });

        }
    }

    @autobind()
    onAuth() {
        console.info('onAuth');
        return this.socket
            .$get('onAuth', {
                hash: this.ls.userKey
            })
            .then((d) => {
                this.can.next(true);

                if (d.result == 'ok') {
                    this.userService.setUser(d.user);
                    this.friendsService.requestFriends();
                    this.friendsService.requestInvites();
                    this.myMarkerService.requestMarkers();

                    //this.userService.friends = d.user.friends;
                    /* this.friend.getInvites();
                     this.chatService.getUnViewed(true);
                     this.myMarkerService.addMarkers(d.user.markers);*/
                } else {
                    this.userService.clearUser();
                }
                return this.mapService.onLoad;


            })
            .then((map: MapGl) => {
                return this.deviceService
                    .setMapGl(map)
                    .onDevices()
                    .then(() => {
                        this.logService.emitLastPosition();
                        return true
                    });
            })
            .catch(err => {
                console.error(err)
            })
    }

    @autobind()
    onConnect() {
        this.toast.show({
            type: 'success',
            text: 'On Air ... '
        });
        this.onAuth();

    }

    @autobind()
    onDisconnect() {
        console.info('disconnect');
        this.toast.show({
            type: 'warning',
            text: 'You are disconnected'
        });
    }

    @autobind()
    onExit(e: Event) {
        this.socket
            .$emit('onExit', {
                hash: this.ls.userKey
            })
            .then(d => {
                if (d.result == 'ok') {
                    this.ls.userKey = null;
                    this.userService.clearUser();
                    this.deviceService.clearDevices();
                    this.myMarkerService.clearAll();
                }
            });

    }

}

