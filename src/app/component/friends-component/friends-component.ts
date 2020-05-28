
import {Component, Directive, ElementRef, Renderer} from "@angular/core";
import {Location} from '@angular/common';
import {FriendsService} from "../../api/friends.service";
import {Router, ActivatedRoute} from "@angular/router";
import {ChatService} from "../../service/chat.service";
import {NavigationHistory} from "../../app.component";
import { User, UserService } from 'src/app/service/main.user.service';
import {ToastService} from '../../shared-module/toast-module/toast.service';


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
                private lh: NavigationHistory ,
                private route: ActivatedRoute,
                private toast: ToastService,
                private router: Router,
                private friendsService: FriendsService,
                private chatService: ChatService){
        this.friends = friendsService.friends;
    }

    onAccept(friend: User){
        //this.friendsService.onAcceptInvite(friend)
    }

    onDelFriend(friend: User){
       // this.friendsService.onDelFriend(friend.id)
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
       // this.friendsService.onRejectInvite(user.id)
    }

    onCancelInvite(user: User){
       // this.friendsService.onCancelInvite(user.id)
    }
    startChat(user: User): void{
        this.chatService.onEnterRoom(user)
    }

    

}
