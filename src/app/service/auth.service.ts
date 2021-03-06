import { Injectable } from '@angular/core';
import { Io } from './socket.oi.service';
import { LocalStorage } from './local-storage.service';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FriendsService } from './friends.service';
import { UserService } from './main.user.service';
import { ChatService } from './chat.service';
import { ToastService } from '../component/toast/toast.component';
import { Deferred } from '../util/deferred';
import { MyMarkerService } from '../service/my-marker.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { autobind } from '../util/autobind';
import { DeviceService } from './device.service';

export interface Setting {
    hill?: boolean;
    id?: number;
    map?: string;
    lock?: boolean;
}


@Injectable()
export class AuthService implements CanActivate {
    socket: any;
    private _userId: number;
    private _userName: string = null;
    private _userImage: string = null;
    private _setting: Setting;
    public can: Subject<boolean> = new Subject();

    constructor(
        private io: Io,
        private ls: LocalStorage,
        private friend: FriendsService,
        private userService: UserService,
        private chatService: ChatService,
        private toast: ToastService,
        private myMarkerService: MyMarkerService,
        private  deviceService: DeviceService,
        private router: Router
    ) {
        this.socket = io.socket;
        this._setting = {};
        this.socket.on('connect', this.onConnect);
        this.socket.on('disconnect', (d) => {
            console.info('disconnect');
            toast.show({
                type: 'warning',
                text: 'You are disconnected'
            });
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.can;
    }


    /*  onAuth() {
          return this.onConnect();
      }*/

    onEnter({name, pass}) {
        return this.socket
            .$emit('onEnter', {
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
    onAuth(){
        console.info('connect');
        return this.socket.$get('onAuth', {
            hash: this.ls.userKey
        }).then((d) => {
            if (d.result == 'ok') {
                this.userService.user = d.user;
                this.userService.friends = d.user.friends;
                this.socket.emit(d.user.hash);
                this.friend.getInvites();
                this.chatService.getUnViewed(true);
                this.myMarkerService.addMarkers(d.user.markers);
            } else {
                this.userName = null;
            }
            this.can.next(true);
        });
    }

    @autobind()
    onConnect() {
       this.onAuth()

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
                    this.userService.clearAll();
                    this.deviceService.clearDevices();
                    this.myMarkerService.clearAll();
                }
            });

    }


    get userName() {
        return this._userName;
    }

    set userName(name) {
        this._userName = name;
    }

    get setting(): Setting {
        return this._setting;
    }

    set setting(value: Setting) {
        this._setting = value;
    }

    get userImage(): string {
        return this._userImage;
    }

    set userImage(value: string) {
        this._userImage = value;
    }

    get userId(): number {
        return this._userId;
    }

    set userId(value: number) {
        this._userId = value;
    }


}

