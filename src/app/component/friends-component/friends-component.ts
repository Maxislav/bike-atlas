
import {Component, Directive, ElementRef, Renderer} from "@angular/core";
import {Location} from '@angular/common';
import {FriendsService, User} from "../../service/friends.service";
import {ToastService} from "../toast/toast.component";


@Directive({
    selector: 'users-container',
})
export class UsersContainer{
    constructor(el: ElementRef, renderer: Renderer){

        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;


        renderer.setElementStyle(el.nativeElement, 'height', y-160+'px');
    }
}
declare const module:{
    id: any
};

@Component({
    //noinspection TypeScriptUnresolvedVariable
    moduleId: module.id,
    templateUrl: './friends-component.html',
    directives: [UsersContainer],
    styleUrls: ['./friends-component.css'],
})
export class FriendsComponent{
    public allUsers: Array<User>;
    public invites: Array<User>;
    public friends: Array<User>;
    private myInvites: Array<any>;
    constructor(private location: Location, private friend: FriendsService, private toast: ToastService ){
        this.allUsers = friend.users;
        this.invites = friend.invites;
        this.friends = friend.friends;
        this.myInvites = friend.myInvites;
    }

    onAccept(friend: User){
        this.friend.onAcceptInvite(friend)
    }

    onDelFriend(friend: User){
        this.friend.onDelFriend(friend.id)

    }
    onClose(){
        this.location.back()
    }
    getAllUsers(){
        this.friend.getAllUsers()
    }
    sendInvite(user){
        this.friend.onInvite(user.id)
    }
    onReject(user){
        this.friend.onRejectInvite(user.id)
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

}