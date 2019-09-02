


import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {Marker} from "./marker.service";
import {LocalStorage} from "./local-storage.service";
import {UserService} from "./main.user.service";
import {ChatService} from "./chat.service";
import {Message} from "../component/chat-component/chat-room/chat-room.component";
import { User } from '../../types/global';

/*

export interface User{
    id: number;
    name: string;
    phone?: string;
    image: string;
    marker ?: Marker;
    chatUnViewed?: Array<number>
}
*/

export interface UserWithChat extends User{
    chatUnViewed: any
}



export interface Friends extends Array<User>{
    promise: Promise<User>
}


@Injectable()
export class FriendsService {


    
    private socket: any;
    //private _friends: Array<User>;
    private _users: Array<UserWithChat>;
    private _invites: Array<User>;
    private _myInvites: Array<User>;
    private _friends: Array<UserWithChat> =[];


    constructor(
        private io: Io,
        private ls: LocalStorage,
        private userService: UserService,
        private chatService: ChatService
    ){
       // this._friends = [];
        this._myInvites = [];
        this._users = [];
        this._invites = [];
        this.socket = io.socket;
        this.socket.on('updateInvites', this.getInvites.bind(this));
        this.socket.on('updateFriends', this.updateFriends.bind(this));
        chatService.addChatUnViewed = this.addChatUnViewed.bind(this)
    }

    getFriends(){
        this.updateFriends()
    }

    updateFriends(){
       return this.socket.$emit('getFriends')
            .then(d=>{
                console.log('getFriends ->', d);
                if(d.result == 'ok'){
                    this.friends = d.friends;
                    this.myInvites = d.invites;
                    this.bindChatUnViewed(this.friends);
                    return this.friends;
                }else{
                    return null;
                }

            })
    }
    bindChatUnViewed(user: Array<UserWithChat>){
        this.chatService.unViewedDefer.promise.then(d=>{
            console.log('unViewedDefer->',d)
            user.forEach(user=>{
                if(d[user.id]){
                    user.chatUnViewed = d[user.id]
                }
            })
        })
    }

    addChatUnViewed(userId: number, mesId: number){
        this.friends.forEach(user=>{
            if(user.id==userId){
                push(user)
            }
        });
        this.users.forEach(user=>{
            if(user.id==userId){
                push(user)
            }
        });

        function push(user: UserWithChat){
            user.chatUnViewed = user.chatUnViewed || [];
            user.chatUnViewed.push(mesId)
        }
    }

    unBindChatUnViewed(userId: number){
        const user = this.users.find(user=>{
            return user.id==userId
        });
        if(user && user.chatUnViewed){
            this.chatService.emitChatViewed(user.chatUnViewed)
                .then(d=>{
                    console.log(d);
                    delete user.chatUnViewed;
                });
        }
        const friend = this.friends.find(user=>{
            return user.id==userId
        });
        if(friend && friend.chatUnViewed){
           this.chatService.emitChatViewed(friend.chatUnViewed)
                .then(d=>{
                    console.log(d);
                    delete friend.chatUnViewed
                });
        }
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
               // console.log(d);
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


        this.socket.$emit('getAllUsers', {hash: this.ls.userKey, id: this.userService.id})
            .then(d=>{
                console.log(d)
                if(d && d.result=='ok'){
                    console.log('getAllUsers->', d)
                    this.users = d.users
                    this.bindChatUnViewed(this.users);
                }else{
                    console.error('getAllUsers', d)
                }
            })
    }

    onInvite(inviteId: number){
        this.socket.$emit('onInvite', {hash: this.ls.userKey, inviteId})
            .then(d=>{
                //console.log(d)
                this.updateFriends()
            })
    }
    onRejectInvite(enemy_id: number){
        this.socket.$emit('onRejectInvite', enemy_id)
            .then(rows=>{
                this.updateFriends();
                this.getInvites();
            })
    }

    onCancelInvite(enemy_id){
        this.socket.$emit('onCancelInvite', enemy_id)
            .then(d=>{
                console.log(d)
                this.updateFriends();
                this.getInvites();
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


    set friends(value:Array<UserWithChat>){
        this._friends.length = 0;

        if(value){
            value.forEach(item=>{
                this._friends.push(item)
            })
        }
    }
    get friends(): Array<UserWithChat>{
     return this._friends
    }
    get users(): Array<UserWithChat> {
        return this._users;
    }

    set users(value: Array<UserWithChat>) {
        this._users.length = 0;
        if(value){
            value.forEach(item=>{
                this._users.push(item)
            })
        }
    }

}
