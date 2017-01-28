import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
@Injectable()
export class JournalService {

    socket: any;
    private _devices: {[id:string]:Array<any>}  = {};

    constructor(io: Io) {
        this.socket = io.socket
    }


    getTrack(from: Date, to: Date): Promise<any> {
        return this.socket
            .$emit('trackFromTo', {
                from,
                to
            })
            .then(d => {
               // console.log(d)
                if(d && d.result == 'ok'){
                    this._devices = d.devices;

                    return this.devices;
                }else {
                    return null
                }

            })
    }
    get devices(): {[p: string]: Array<any>} {
        return this._devices;
    }

    set devices(value: {[p: string]: Array<any>}) {
        for (let key in value){
            this._devices[key] = value[key]
        }
    }


}
