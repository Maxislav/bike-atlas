import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {LocalStorage} from "./local-storage.service";
import {AuthService} from "./auth.service";
import {DeviceService} from "./device.service";
import {ToastService} from "../component/toast/toast.component";
import {FriendsService} from "./friends.service";
import {LogService} from "./log.service";
import {UserService} from "./main.user.service";
/**
 * Created by max on 04.01.17.
 */
@Injectable()
export class LoginService{
    private socket: any;
    constructor( private  io: Io,
                 private ls: LocalStorage,
                 public as: AuthService,
                 private ds: DeviceService,
                 private ts: ToastService,
                 private logService: LogService,
                 private userService: UserService,
                 private friend: FriendsService,){
        this.socket = io.socket;
    }
    onEnter({name, pass}){
        return this.socket
            .$emit('onEnter', {
                name: name,
                pass: pass
            })
            .then(this.setHashName.bind(this));

    }

    onExit(e: Event) {
        this.socket
            .$emit('onExit', {
                hash: this.ls.userKey
            })
            .then(d => {
                if (d.result == 'ok') {

                    this.ls.userKey = null;
                    this.userService.clearUser();
                    this.friend.clearUsers();
                    this.logService.clearDevices();
                    this.ds.clearDevice()
                }
            })

    }
    setHashName(d){
        console.log(d);
        switch (d.result) {
            case 'ok':
                this.ls.userKey = d.hash;
                this.userService.user = d.user;
                this.friend.updateFriends()
                    .then(d=>{
                        this.ds.updateDevices()
                            .then(d=>{
                                this.logService.getLastPosition()
                            })
                    });
                this.friend.getInvites();

                /*this.ls.userKey = d.hash;
                this.as.userName = d.user.name;
                this.as.userImage = d.user.image;
                this.as.userId = d.user.id;
                this.ds.updateDevices();
                this.friend.getInvites();*/


                break;
            case false:
                this.ts.show({
                    type: 'warning',
                    text: 'Невеное имя пользователя или пароль'
                })

        }
    }
}