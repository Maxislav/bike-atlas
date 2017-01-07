
import {Injectable} from "@angular/core";
export interface User{
    name: string;
    id: number;
    image: string
}

@Injectable()

export class UserService{
    private _user: User;
    constructor(){
        this._user = {
            name: null,
            id: null,
            image: null
        }
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        for(let opt in this._user){
            this._user[opt] = value[opt]
        }
    }




}

