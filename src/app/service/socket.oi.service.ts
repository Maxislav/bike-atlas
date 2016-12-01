import {Injectable} from "@angular/core"
import * as io from "socket/socket.io.js";


declare const io: any;


@Injectable()
export class Io{
   

    private _socket: any;

    constructor(){
        this._socket = io("http://"+window.location.hostname+":8081");
        this._socket.on('news',(d)=>{
            //console.log(d,'klklttewefewfwe')
        });
    }
    get socket():any {
        return this._socket;
    }
    
    
}