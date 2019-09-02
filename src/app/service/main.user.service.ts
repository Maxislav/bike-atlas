import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Io } from './socket.oi.service';
import { ToastService } from '../component/toast/toast.component';
import { Router } from '@angular/router';
import { Deferred } from '../util/deferred';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export class User {
    public id: string = null;
    public image: string = null;
    public  name: string = null;
    private _initialData = {};
    constructor() {
        Object.keys(this).forEach(key => {
            if(key!=='_initialData'){
                this._initialData[key] = this[key]
            }
        })

    }



    update(data: User){
        Object.keys(this).forEach(key => {
            if(key!=='_initialData'){
                this[key] = data[key]
            }
        })
    }

    clear(){
        Object.keys(this._initialData).forEach(key => {
            if(key!=='_initialData'){
                this[key] = this._initialData[key]
            }
        })
    }
}


export class Setting {
    hill: false;
    map: string = '';
    lock =  true;
    constructor(){

    }
    update(s){
        Object.keys(this).forEach(key => {
            this[key] = s[key]
        })
    }
}


@Injectable()
export class UserService  {


    public id;
    private readonly user: User =  new User();
    private readonly setting: Setting = new Setting();
    private friends: Array<User> = [];
    private socket: any;


    constructor(
        private io: Io,
        private toast: ToastService,
        private router: Router
    ) {
        this.socket = io.socket;
    }


    onUserImage(data) {

    }

    getSetting(){
        return this.setting;
    }


    getUserImageById(id: number) {
    /*    if (!this.deferImage[id]) {
            this.deferImage[id] = new Deferred();
            this.socket.$emit('getUserImage', id);
        }
        return this.deferImage[id].promise;*/
    }
    getUser(): User{
        return this.user
    }

    setUser(u: User){
        this.user.update(u);
        this.id = this.user.id;
    }

    clearUser() {
        this.user.clear();
        this.id = null;
    }

    setSetting(s){
        this.setting.update(s)
    }





    clearAll() {
       /* this.user.devices.forEach(device => {
            if (device.marker) {
                device.marker.remove();
            }
        });
        this.friends.forEach(friend => {
            friend.devices.forEach(device => {
                if (device.marker) {
                    device.marker.remove();
                }
            });
        });
        while (this.friends.length) {
            this.friends.shift();
        }
        this.clearUser();*/
    }

    createDeviceOther(device) {
       /* this._other.devices.push(device);
        return device;*/
    }


  /*  get other(): User {
        return this._other;
    }

    set other(value: User) {
        this._other = value;
    }


    set friends(friends: Array<User>) {
        if (!friends) return;
        this._friends.length = 0;
        friends.forEach(friend => {
            this._friends.push(friend);
        });
    }

    get friends() {
        return this._friends;
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        console.log('set user ->', value);
        for (let opt in value) {
            this._user[opt] = value[opt];
        }
    }*/

   /* public resolve() {

    }

    public reject() {

    }*/


}

