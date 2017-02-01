
import {Component} from "@angular/core";
import {FriendsService} from "../../service/friends.service";
import {User} from "../../service/main.user.service";
@Component({
    moduleId: module.id,
    templateUrl: './all-user.component.html',
    styleUrls: ['./all-user.component.css'],
})

export class AllUserComponent{
    private allUsers;
    private friends;
    private invites;
    private myInvites;

    constructor(private friendsService: FriendsService){
        this.allUsers = friendsService.users;
        this.friends = friendsService.friends;
        this.invites = friendsService.invites;
        this.myInvites = friendsService.myInvites;
        friendsService.getAllUsers();
    }
    sendInvite(user){
        this.friendsService.onInvite(user.id)
    }
    onReject(user){
        this.friendsService.onRejectInvite(user.id)
    }
    onCancelInvite(user: User){
        this.friendsService.onCancelInvite(user.id)
    }

    isInviteActive(user: User){
        let i = 0;
        while (i<this.myInvites.length){
            if( this.myInvites[i].invite_user_id == user.id){
                return true
            }
            i++;
        }
        return false
    }
    isFriend(user: User){
        let i = 0;

        while (i<this.friends.length){
            if(this.friends[i].id == user.id){
                return true
            }
            i++;
        }

        return false
    }
    startChat(userId: number): void{
            console.log(userId)
    }
}
