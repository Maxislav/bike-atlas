import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Io } from './socket.oi.service';
import { Router } from '@angular/router';
import {ToastService} from '../shared-module/toast-module/toast.service';


export class User {
    id: number = null;
    image: string = null;
    name: string = null;
    lastVisit: string = null;
    private _initialData = {};
    constructor(user?: User) {

        Object.keys(this).forEach(key => {
            if(key!=='_initialData'){
                if(user){
                    this[key] = user[key]
                }
                this._initialData[key] = this[key];
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

    toJson(){
        const d = {};
        Object.keys(this).forEach(key => {
            if(key!=='_initialData'){
                d[key] = this[key]
            }
        });
        return d;
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

    // friends: Array<User> = [];
    id;
    private readonly user: User =  new User();
    private readonly setting: Setting = new Setting();
    private socket: any;


    constructor(
        private io: Io,
    ) {
        this.socket = io.socket;
    }


    onUserImage(data) {

    }

    getSetting(){
        return this.setting;
    }


    getUserImageById(id: number) {

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
    }

    createDeviceOther(device) {

    }

}

