import {Injectable} from "@angular/core"
import * as io from "socket/socket.io.js";
import {Aes} from './aes-cript';


declare const io: any;

interface Socket{
    emit: Function;
    $emit: Function;
    $encrypt: Function;
    $decrypt: Function;
    on: Function;
    off: Function;
}


@Injectable()
export class Io{
   

    private _socket: Socket;

    constructor(){

        if(window.location.hostname.match(/github\.io/)){
            this._socket = io("http://178.62.44.54:8081");
        }else{
            this._socket = io("http://"+window.location.hostname+":8081");
        }


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

        this._socket.$encrypt = (name: string, data: any) => {
            const aes = new Aes(16);
            const mess = JSON.stringify(data);
            return this._socket
                .$emit(name, {
                    n: 0,
                    byteArr: Array.from(aes.encodeTextToByte(mess))
                })
                .then(d => {
                    const enc2 = new Uint8Array(d.byteArr);
                    return this._socket.$emit(name, {
                        n: 1,
                        byteArr: Array.from(aes.decodeByteToByte(enc2)),
                    })
                })


        }




    }
    get socket():Socket {
        return this._socket;
    }
    
    
}