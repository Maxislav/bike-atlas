


import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {Marker} from "./marker.service";
import {LocalStorage} from "./local-storage.service";
import {AuthService} from "./auth.service";


export interface User{
    id: string;
    name: string;
    phone?: string;
    image: string;
    marker ?: Marker;
}



export interface Friends extends Array<User>{
    promise: Promise<User>
}


@Injectable()
export class FriendsService {
    
    private socket: any;
    private _friends: Array<User>;
    private _users: Array<User>;


    constructor(
        private io: Io,
        private ls: LocalStorage,
        private as: AuthService
    ){
        this._friends = [];
        this._users = [];
        this.socket = io.socket;
    }

    updateFriends(){
        const hash = this.ls.userKey;
        this.socket.$emit('getFriends', {hash})
            .then(d=>{

            })
    }

    getAllUsers(){
        this.socket.$emit('getAllUsers', {hash: this.ls.userKey, id: this.as.userId})
            .then(d=>{
                console.log(d)
                if(d && d.result=='ok'){
                    this.users = d.users
                }else{
                    console.error('getAllUsers', d)
                }
            })
    }


    set friends(value:Array<User>){
        this._friends.length = 0;
        if(value){


            value.forEach(item=>{
                this._friends.push(item)

            })
        }
    }
    get friends(): Array<User>{
     return this._friends
    }
    get users(): Array<User> {
        return this._users;
    }

    set users(value: Array<User>) {
        this._users.length = 0;
        if(value){
            value.forEach(item=>{
                this._users.push(item)

            })
        }
    }

}
