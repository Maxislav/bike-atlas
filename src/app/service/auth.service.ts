import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {LocalStorage} from "./local-storage.service";

@Injectable()
export class AuthService {
    socket: any;
    private _userName: string = null;

    constructor(private io: Io, private  ls: LocalStorage) {
        this.socket = io.socket;

        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('disconnect', (d) => {
            console.log('disconnect');
            this.userName = null;
        });
    }

    onConnect() {
        this.socket.$emit('onAuth', {
            hash: this.ls.userKey
        }).then(d => {
            if(d.result =='ok'){
                this.userName = d.user.name
            }else{
                this.userName = null;
            }
            console.log(d)
        })

    }


    get userName() {
        return this._userName;
    }

    set userName(name) {
        this._userName = name
    }
}

