import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {LocalStorage} from "./local-storage.service";
import {DeviceService} from "./device.service";
import {Resolve} from "@angular/router";

@Injectable()
export class AuthService implements Resolve<any>{
    socket: any;
    private _userName: string = null;
    private resolveAuth: Function;
    constructor(private io: Io, private  ls: LocalStorage, private ds: DeviceService) {
        this.socket = io.socket;
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('disconnect', (d) => {
            console.log('disconnect');
            this.userName = null;
        });
    }
    resolve(): Promise<any> {
        return new Promise((resolve, reject)=>{
            this.resolveAuth = resolve;

        });
    }

    onConnect() {
        this.socket.$emit('onAuth', {
            hash: this.ls.userKey
        }).then(d => {
            if(d.result =='ok'){
                this.userName = d.user.name;
                this.ds.updateDevices()
            }else{
                this.userName = null;
            }
            console.log(d)
            this.resolveAuth(true)
        })
    }

    get userName() {
        return this._userName;
    }

    set userName(name) {
        this._userName = name
    }
}

