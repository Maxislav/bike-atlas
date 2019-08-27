
import {Component, Directive, ElementRef, Renderer} from "@angular/core";
import {Location} from '@angular/common';
import {FriendsService} from "../../service/friends.service";
import {ToastService} from "../toast/toast.component";
import {Router, ActivatedRoute} from "@angular/router";
import {ChatService} from "../../service/chat.service";
import {NavigationHistory} from "../../app.component";
import { User } from '../../../types/global';


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
        renderer.setElementStyle(el.nativeElement, 'max-height', y-160+'px');
    }
}

@Component({
    //noinspection TypeScriptUnresolvedVariable
    templateUrl: './friends-component.html',
    styleUrls: ['./friends-component.less'],
})
export class FriendsComponent{
    public allUsers: Array<User>;
    public invites: Array<User>;
    public friends: Array<User>;
    private myInvites: Array<any>;
    constructor(private location: Location,
                private friendsService: FriendsService,
                private lh: NavigationHistory ,
                private route: ActivatedRoute,
                private toast: ToastService,
                private router: Router,
                private chatService: ChatService){

        this.allUsers = friendsService.users;
        this.invites = friendsService.invites;
        this.friends = friendsService.friends;
        this.myInvites = friendsService.myInvites;
        friendsService.getFriends()
    }

    onAccept(friend: User){
        this.friendsService.onAcceptInvite(friend)
    }

    onDelFriend(friend: User){
        this.friendsService.onDelFriend(friend.id)
    }
    onClose(){
        if(this.lh.is){
            this.location.back()
        }else{
            this.router.navigate(['/auth/map']);
        }
    }
    getAllUsers(){
        this.router.navigate(['/auth/map/friends/all']);
    }
   
    onReject(user){
        this.friendsService.onRejectInvite(user.id)
    }

    onCancelInvite(user: User){
        this.friendsService.onCancelInvite(user.id)
    }
    startChat(user: User): void{
        this.chatService.onEnterRoom(user)
    }

    

}