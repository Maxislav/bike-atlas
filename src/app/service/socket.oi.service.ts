import {Injectable} from "@angular/core"
import * as io from "socket/socket.io.js";


declare const io: any;


@Injectable()
export class Io{
   

    private _socket: any;

    constructor(){
        this._socket = io("http://"+window.location.hostname+":8081");

        this._socket.$emit = (name: string, data: Object)=>{
            return new Promise((resolve, reject)=>{
                const timeout = setTimeout(()=>{

                    reject('Error by timeout name->'+name)
                }, 30000);
                const response = (d) =>{
                    clearTimeout(timeout);
                    this.socket.off(name, response);
                    resolve(d);
                };

                this.socket.on(name, response);
                this.socket.emit(name, data)
            })
        }
        this._socket.on('news',(d)=>{
            //console.log(d,'klklttewefewfwe')
        });
    }
    get socket():any {
        return this._socket;
    }
    
    
}