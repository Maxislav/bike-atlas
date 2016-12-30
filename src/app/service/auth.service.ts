import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {LocalStorage} from "./local-storage.service";

@Injectable()
export class AuthService{
        socket: any;
        private _userName: string = null;
        constructor(private io: Io, private  ls : LocalStorage){
            /*this.socket = io.socket;

            this.socket.on('connect',(d)=>{
                console.log('connect');
                console.log(ls.userKey);


            });
            this.socket.on('disconnect', (d)=>{
                console.log('disconnect');
                this.userName = null;
            });
*/
            //this.socket.on('onAuth', this.onAuth.bind(this))
        }




        get userName(){
          return this._userName;
        }

        set userName(name){
            this._userName = name
        }
}

