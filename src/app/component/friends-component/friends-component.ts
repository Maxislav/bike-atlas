
import {Component} from "@angular/core";
import {Location} from '@angular/common';
import {FriendsService, User} from "../../service/friends.service";

@Component({
    //noinspection TypeScriptUnresolvedVariable
    moduleId: module.id,
    templateUrl: './friends-component.html',
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
}