import { Injectable } from '@angular/core';
import { Io } from './socket.oi.service';
import { LocalStorage } from './local-storage.service';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { FriendsService } from '../api/friends.service';
import { UserService } from './main.user.service';
import { ChatService } from './chat.service';
import { MyMarkerService } from './my-marker.service';
import { autobind } from '../util/autobind';
import { DeviceService } from './device.service';
import { LogService } from './log.service';
import { MapService } from 'src/app/service/map.service';
import { MapGl } from 'src/types/global';
import {ToastService} from '../shared-module/toast-module/toast.service';
import {Observable, Subject} from 'rxjs';
import {first} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class AuthService implements CanActivate {
    socket: any;
    private unsubscribe$ = new Subject<void>();
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
        private mapService: MapService,
        private route: ActivatedRoute
    ) {
        this.socket = io.socket;
        this.socket.on('connect', this.onConnect);
        this.socket.on('disconnect', this.onDisconnect);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.can;
    }

    onEnter({name, pass}) {
       console.log('name pass', name, pass);
        return this.socket
            .$get('onEnter', {
                name: name,
                pass: pass
            })
            .then(this.setHashName);
    }

    @autobind()
    private setHashName(d) {
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

    onAuth() : Promise<boolean>{
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
                    this.friendsService.requestRequests();
                    this.myMarkerService.requestMarkers();
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
        // tslint:disable-next-line:no-console
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

