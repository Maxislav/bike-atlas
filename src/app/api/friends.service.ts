import { Injectable } from '@angular/core';
import { Io, SSocket } from '../service/socket.oi.service';
import { Marker } from '../service/marker.service';
import { LocalStorage } from '../service/local-storage.service';
import { User, UserService } from '../service/main.user.service';
import { ChatService } from '../service/chat.service';
import { Message } from '../component/chat-component/chat-room/chat-room.component';


export interface UserWithChat extends User {
    chatUnViewed: any
}


export interface Friends extends Array<User> {
    promise: Promise<User>
}


export interface InviteInterface {
    myInvite: Array<User>;
    userInvite: Array<User>;
}

@Injectable()
export class FriendsService {


    friends: Array<User> = [];
    allUsers: Array<User> = [];
    inviteMap: InviteInterface = {
        myInvite: [],
        userInvite: []
    };

    private socket: SSocket;


    constructor(
        private io: Io,
        private chatService: ChatService
    ) {
        this.socket = io.socket;

        /* // this._friends = [];
         this._myInvites = [];
         this._users = [];
         this._invites = [];
         this.socket = io.socket;
         this.socket.on('updateInvites', this.getInvites.bind(this));
         this.socket.on('updateFriends', this.updateFriends.bind(this));
         chatService.addChatUnViewed = this.addChatUnViewed.bind(this);*/
    }

    requestFriends(): Promise<this> {
        return this.socket.$get('getFriends', {})
            .then(d => {
                console.log(d);
                return this;
            })
            .catch(err => {
                console.error(err);
                return err;
            });

    }

    requestAllUsers(): Promise<Array<User>> {
        return this.socket.$get('getAllUsers', {})
            .then(d => {
                console.log(d);
                if (d && d.result == 'ok') {
                    /* this.allUsers.length = 0;
                     d.users.forEach(user => {
                         const u = new User(user);
                         this.allUsers.push(u)
                     })*/
                    return d.users.map(user => {
                        return new User(user);
                    });
                }
                return [];
            });
    }

    requestInvites(): Promise<this> {
        return this.socket.$get('getInvites', {})
            .then(d => {

                console.log(d);

                return this;
            })
            .catch(err => {
                console.error(err);
            });


    }

    requestUserById(id: number): Promise<{result: string, user:User}> {
        return this.socket.$get('requestUserById', {id});
    }

    sendInvite(user: User): Promise<any> {
        this.inviteMap.myInvite.push(user);
        return this.socket.$get<any>('onInvite', user.toJson());
    }

    onCancelInvite(user: User) {
        const index = this.inviteMap.myInvite.findIndex(u => u.id === user.id);
        this.inviteMap.myInvite.splice(index, 1);
    }

    /* getFriends() {
         this.updateFriends();
     }

     updateFriends() {
         return this.socket.$emit('getFriends')
             .then(d => {
                 console.log('getFriends ->', d);
                 if (d.result == 'ok') {
                     this.friends = d.friends;
                     this.myInvites = d.invites;
                     this.bindChatUnViewed(this.friends);
                     return this.friends;
                 } else {
                     return null;
                 }

             });
     }

     bindChatUnViewed(user: Array<UserWithChat>) {
         this.chatService.unViewedDefer.promise.then(d => {
             console.log('unViewedDefer->', d);
             user.forEach(user => {
                 if (d[user.id]) {
                     user.chatUnViewed = d[user.id];
                 }
             });
         });
     }

     addChatUnViewed(userId: string, mesId: number) {
         this.friends.forEach(user => {
             if (user.id == userId) {
                 push(user);
             }
         });
         this.users.forEach(user => {
             if (user.id == userId) {
                 push(user);
             }
         });

         function push(user: UserWithChat) {
             user.chatUnViewed = user.chatUnViewed || [];
             user.chatUnViewed.push(mesId);
         }
     }

     unBindChatUnViewed(userId: string) {
         const user = this.users.find(user => {
             return user.id == userId;
         });
         if (user && user.chatUnViewed) {
             this.chatService.emitChatViewed(user.chatUnViewed)
                 .then(d => {
                     console.log(d);
                     delete user.chatUnViewed;
                 });
         }
         const friend = this.friends.find(user => {
             return user.id == userId;
         });
         if (friend && friend.chatUnViewed) {
             this.chatService.emitChatViewed(friend.chatUnViewed)
                 .then(d => {
                     console.log(d);
                     delete friend.chatUnViewed;
                 });
         }
     }


     onDelFriend(id: string) {
         this.socket.$emit('onDelFriend', id)
             .then((d) => {
                 console.log(d);
                 this.updateFriends();

             });
     }

     getInvites() {
         const hash = this.ls.userKey;
         this.socket.$emit('getInvites', {hash})
             .then((d) => {
                 // console.log(d);
                 this.invites = d;
             });

     }

     onAcceptInvite(friend: User) {
         return this.socket.$emit('onAcceptInvite', friend.id)
             .then(d => {
                 this.updateFriends();
                 this.getInvites();
             });

     }

     getAllUsers() {


         this.socket.$emit('getAllUsers', {hash: this.ls.userKey, id: this.userService.id})
             .then(d => {
                 console.log(d);
                 if (d && d.result == 'ok') {
                     console.log('getAllUsers->', d);
                     this.users = d.users;
                     this.bindChatUnViewed(this.users);
                 } else {
                     console.error('getAllUsers', d);
                 }
             });
     }

     onInvite(inviteId: number) {
         this.socket.$emit('onInvite', {hash: this.ls.userKey, inviteId})
             .then(d => {
                 //console.log(d)
                 this.updateFriends();
             });
     }

     onRejectInvite(enemy_id: number) {
         this.socket.$emit('onRejectInvite', enemy_id)
             .then(rows => {
                 this.updateFriends();
                 this.getInvites();
             });
     }

     onCancelInvite(enemy_id) {
         this.socket.$emit('onCancelInvite', enemy_id)
             .then(d => {
                 console.log(d);
                 this.updateFriends();
                 this.getInvites();
             });
     }

     clearUsers() {
         this.users = [];
         this.invites = [];
     }


     get invites(): Array<User> {
         return this._invites;
     }

     set invites(value: Array<User>) {
         this._invites.length = 0;
         value.forEach(item => {
             this._invites.push(item);
         });
     }

     get myInvites(): Array<User> {
         return this._myInvites;
     }

     set myInvites(value: Array<User>) {
         this._myInvites.length = 0;
         value.forEach(item => {
             this._myInvites.push(item);
         });
     }


     set friends(value: Array<UserWithChat>) {
         this._friends.length = 0;

         if (value) {
             value.forEach(item => {
                 this._friends.push(item);
             });
         }
     }

     get friends(): Array<UserWithChat> {
         return this._friends;
     }

     get users(): Array<UserWithChat> {
         return this._users;
     }

     set users(value: Array<UserWithChat>) {
         this._users.length = 0;
         if (value) {
             value.forEach(item => {
                 this._users.push(item);
             });
         }
     }*/

}
