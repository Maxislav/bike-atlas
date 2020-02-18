import {Io} from "../service/socket.oi.service";
import {Injectable} from "@angular/core";


export interface RegistrationFormIs {
    name: string;
    pass: string;
    repeatPass: string
}

@Injectable()
export class RegistrationService {
    private socket: any;
    constructor( private io: Io){
        this.socket = io.socket;
    }

    onRegister(data: RegistrationFormIs ): Promise<any>{
        return  this.socket.$get('onRegister', data)
    }

}
