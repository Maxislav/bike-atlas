


import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {Marker} from "./marker.service";
import {LocalStorage} from "./local-storage.service";
import {UserService} from "./main.user.service";


export interface User{
    id: number;
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
    private _invites: Array<User>;
    private _myInvites: Array<User>;


    constructor(
        private io: Io,
        private ls: LocalStorage,
        private userService: UserService
    ){
        this._friends = [];
        this._myInvites = [];
        this._users = [];
        this._invites = [];
        this.socket = io.socket;
    }

    updateFriends(){
       return this.socket.$emit('getFriends')
            .then(d=>{
                console.log(d);
                if(d.result == 'ok'){
                    this.friends = d.friends;
                    this.myInvites = d.invites;
                    return this.friends;
                }else{
                    return null;
                }

            })
    }
    onDelFriend(id: number){
        this.socket.$emit('onDelFriend', id)
            .then((d)=>{
                console.log(d);
                this.updateFriends()

            });
    }

    getInvites(){
        const hash = this.ls.userKey;
        this.socket.$emit('getInvites', {hash})
            .then((d)=>{
                console.log(d);
                this.invites = d;
            });

    }

    onAcceptInvite(friend: User){
       return this.socket.$emit('onAcceptInvite', friend.id)
            .then(d=>{
                this.updateFriends();
                this.getInvites()
            })


    }

    getAllUsers(){
        this.socket.$emit('getAllUsers', {hash: this.ls.userKey, id: this.userService.user.id})
            .then(d=>{
                console.log(d)
                if(d && d.result=='ok'){
                    this.users = d.users
                }else{
                    console.error('getAllUsers', d)
                }
            })
    }

    onInvite(inviteId: number){
        this.socket.$emit('onInvite', {hash: this.ls.userKey, inviteId})
            .then(d=>{
                console.log(d)
                this.updateFriends()
            })
    }
    onRejectInvite(enemy_id: number){
        
        this.socket.$emit('onRejectInvite', enemy_id)
            .then(rows=>{
                this.updateFriends()
                this.getInvites()
            })
    }

    clearUsers(){
        this.users = [];
        this.invites = []
    }


    get invites(): Array<User> {
        return this._invites;
    }

    set invites(value: Array<User>) {
        this._invites.length = 0;
        value.forEach(item=>{
            this._invites.push(item)
        })
    }
    get myInvites(): Array<User> {
        return this._myInvites;
    }

    set myInvites(value: Array<User>) {
        this._myInvites.length = 0;
        value.forEach(item=>{
            this._myInvites.push(item)
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
