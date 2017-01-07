
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


        renderer.setElementStyle(el.nativeElement, 'height', y-300+'px');
    }
}
declare const module:{
    id: any
}

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
    constructor(private location: Location, private friend: FriendsService, private toast: ToastService ){
        this.allUsers = friend.users;
        this.invites = friend.invites;
    }

    onAccept(d){
        console.log(d)
       this.toast.show({
            type: 'warning',
            text: "Функция в рвзработке"
        })
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

}