
import {Component, Directive, ElementRef, Renderer} from "@angular/core";
import {Location} from '@angular/common';
import {FriendsService, User} from "../../service/friends.service";


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
    constructor(private location: Location, private fr: FriendsService){
        this.allUsers = fr.users;
    }
    onClose(){
        this.location.back()
    }
    getAllUsers(){
        this.fr.getAllUsers()
    }
    sendInvite(user){
        this.fr.onInvite(user.id)
        //console.log(user.id)
    }

}