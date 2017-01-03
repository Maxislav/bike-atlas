import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";

@Injectable()
export class LogService{
    private socket: any;
    constructor(io: Io){
        this.socket = io.socket;
        this.socket.on('log',this.log.bind(this))
    }
    log(d){
      console.log(d)
    }
}

