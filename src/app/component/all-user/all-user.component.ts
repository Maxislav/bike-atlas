import { Component } from '@angular/core';
import { FriendsService } from '../../api/friends.service';
import { ChatService } from '../../service/chat.service';
import { User } from '../../service/main.user.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './all-user.component.html',
    styleUrls: ['./all-user.component.less'],
})

export class AllUserComponent {
    public allUsers: Array<User> = [];
    private friends: Array<User> = [];
    private invites: Array<any> = [];

    constructor(
        private friendsService: FriendsService,
        private chatService: ChatService,
        private router: Router
    ) {
        // this.allUsers = friendsService.users;
        this.friends = friendsService.friends;
        //this.allUsers = friendsService.allUsers;
        // this.invites = friendsService.invites;
        //this.myInvites = friendsService.myInvites;
        //friendsService.getAllUsers();

        this.friendsService.requestAllUsers()
            .then(userList => {
                this.allUsers = userList
            });

    }

    sendInvite(user) {
        this.friendsService.sendInvite(user);
    }

    onCancelInvite(user: User) {
        this.friendsService.onCancelInvite(user);
    }

    onReject(user) {
        //this.friendsService.onRejectInvite(user.id);
    }



    isInviteActive(user: User) {
        return this.friendsService.inviteMap.myInvite.some(u => {
            return u.id === user.id;
        });
    }

    isFriend(user: User) {
        let i = 0;

        while (i < this.friends.length) {
            if (this.friends[i].id == user.id) {
                return true;
            }
            i++;
        }

        return false;
    }

    onUserClick(user: User){
        this.router.navigate(['/auth/map/friends/', user.id]);
    }

    startChat(user: User): void {
        this.chatService.onEnterRoom(user);
    }
}
