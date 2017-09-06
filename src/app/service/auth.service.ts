import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {LocalStorage} from "./local-storage.service";
import {DeviceService} from "./device.service";
import {Resolve} from "@angular/router";
import {FriendsService} from "./friends.service";
import {UserService} from "./main.user.service";
import {LogService} from "./log.service";
import {ChatService} from "./chat.service";

export interface Setting{
    hill?: boolean;
    id?: number;
    map?: string;
    lock?: boolean;
}

export interface FBuser{
    userID: number | null,
    name: string | null,
    hash?: string,
    accessToken?: string,
    imageUrl?: string
}

declare const FB: any;

@Injectable()
export class AuthService implements Resolve<any>{
    socket: any;
    private _userId: number;
    private _userName: string = null;
    private _userImage: string = null;
    private _setting: Setting;

    private fbUser: FBuser = {userID: null, name: null};


    private resolveAuth: Function;
    constructor(
        private io: Io,
        private ls: LocalStorage,
        private friend: FriendsService,
        private userService: UserService,
        private chatService: ChatService
    ) {
        this.socket = io.socket;
        this._setting = {};
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('disconnect', (d) => {
            console.info('disconnect');
        });
    }
    resolve(): Promise<any> {
        return new Promise((resolve, reject)=>{
            this.resolveAuth = resolve;
        });
    }

    onAuth(){
      return this.onConnect()
    }

    onConnect() {

        //this.resolveAuth(true);



        console.info('connect');
        return this.socket.$emit('onAuth', {
            hash: this.ls.userKey
        }).then(d => {
            if(d.result =='ok'){
                this.userService.user = d.user;
                this.userService.friends = d.user.friends;
                this.socket.emit(d.user.hash);
                this.friend.getInvites();
                this.chatService.getUnViewed(true)
            }else{
                this.userName = null;
                console.info(d);
                FB.getLoginStatus((response)=> {
                    this.statusChangeCallback(response);
                })
            }
            console.log(d);
            this.resolveAuth(true)
        })
    }

    private statusChangeCallback(res){
        switch (res.status){
            case "unknown":
            case "not_authorized":
                this.fbUser.name = null;
                this.fbUser.userID = null;
                break;
            case "connected":
                this.fbUser.userID = parseInt(res.authResponse.userID);
                const authResponse: FBuser = res.authResponse;
                FB.api('/me', (response)=> {
                    this.fbUser.name  = response.name;
                    this
                        .setFacebookUser({
                            name: this.fbUser.name,
                            accessToken: authResponse.accessToken,
                            userID: authResponse.userID
                        })
                        .then(d => {
                            d
                        })
                });
                break

        }
    }


    setFacebookUser(data: FBuser) : Promise<any>{
        return this.socket.$emit('setFacebookUser', data )
            .then(d=>{
                this.userService.user = d.user
                return d
            })
    }


    get userName() {
        return this._userName;
    }
    set userName(name) {
        this._userName = name
    }
    get setting(): Setting {
        return this._setting;
    }
    set setting(value: Setting  ) {
        this._setting = value;
    }
    get userImage(): string {
        return this._userImage;
    }
    set userImage(value: string) {
        this._userImage = value;
    }
    get userId(): number {
        return this._userId;
    }

    set userId(value: number) {
        this._userId = value;
    }
}

