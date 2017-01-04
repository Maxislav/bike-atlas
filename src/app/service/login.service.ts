import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {LocalStorage} from "./local-storage.service";
import {AuthService} from "./auth.service";
import {DeviceService} from "./device.service";
import {ToastService} from "../component/toast/toast.component";
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
                 private ts: ToastService){
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
    setHashName(d){
        console.log(d);
        switch (d.result) {
            case 'ok':
                this.ls.userKey = d.hash;
                this.as.userName = d.name;
                this.ds.updateDevices();
                break;
            case false:
                this.ts.show({
                    type: 'warning',
                    text: 'Невеное имя пользователя или пароль'
                })

        }
    }
}