
import {Injectable} from "@angular/core";
import {Device} from "./device.service";


export interface User{
    id: number;
    name: string;
    image: string;
    deviceKeys?:Array<string>
    devices?: Array<Device>
}


@Injectable()

export class UserService{
    private _user: User;
    private _friends: Array<User> = [];
    private _other:Array<User> = [];
    constructor(){
        this._user = {
            name: null,
            id: null,
            image: null
        };

    }

    clearUser(){
       for (let opt in this._user){
           this._user[opt] = null
       }
    }

    set friends(friends: Array<User>){
        if(!friends) return;
        this._friends.length = 0;
        friends.forEach(friend=>{
            this._friends.push(friend)
        })
    }
    get friends(){
        return this._friends
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        for(let opt in value){
            this._user[opt] = value[opt]
        }
    }




}

