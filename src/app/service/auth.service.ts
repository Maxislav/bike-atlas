import { Injectable } from '@angular/core';
import { Io } from './socket.oi.service';
import { LocalStorage } from './local-storage.service';
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { FriendsService } from './friends.service';
import { UserService } from './main.user.service';
import { ChatService } from './chat.service';
import { ToastService } from '../component/toast/toast.component';
import { Deferred } from '../util/deferred';
import { MyMarkerService } from '../service/my-marker.service';

export interface Setting {
    hill?: boolean;
    id?: number;
    map?: string;
    lock?: boolean;
}


@Injectable()
export class AuthService implements Resolve<boolean>, CanActivate {
    socket: any;
    private _userId: number;
    private _userName: string = null;
    private _userImage: string = null;
    private _setting: Setting;
    private resolveAuth: Function;
    private rejectAuth: Function;
    public resolver: Promise<boolean>;
    public canActiveDefer: Deferred<boolean> = new Deferred();

    constructor(
        private io: Io,
        private ls: LocalStorage,
        private friend: FriendsService,
        private userService: UserService,
        private chatService: ChatService,
        private toast: ToastService,
        private myMarkerService: MyMarkerService,
        private router: Router
    ) {
        this.socket = io.socket;
        this._setting = {};
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('disconnect', (d) => {
            console.info('disconnect');
        });
        this.canActiveDefer.promise
            .catch(d => {
                return d;
            });


        this.resolver = new Promise((resolve, reject) => {
            this.resolveAuth = resolve;
            this.rejectAuth = reject;
        });
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.canActiveDefer.promise
            .then(v => {
                if (!v) {
                    this.toast.show({
                        type: 'warning',
                        translate: 'NOT_LOGGED'
                    });
                    this.router.navigate(['/auth/map']);
                }
                return v;
            });
    }


    resolve(): Promise<boolean> {
        return this.resolver;
    }

    onAuth() {
        return this.onConnect();
    }

    onConnect() {
        console.info('connect');
        return this.socket.$emit('onAuth', {
            hash: this.ls.userKey
        }).then((d) => {
            if (d.result == 'ok') {
                this.userService.user = d.user;
                this.userService.friends = d.user.friends;
                this.socket.emit(d.user.hash);
                this.friend.getInvites();
                this.chatService.getUnViewed(true);
                this.canActiveDefer.resolve(true);

                this.myMarkerService.addMarkers(d.user.markers)

            } else {
                this.userName = null;
                this.canActiveDefer.reject(false);
            }
            console.log('onAuth ->', d);
            this.resolveAuth(true);
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

