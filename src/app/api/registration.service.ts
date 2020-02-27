import {Io} from "../service/socket.oi.service";
import {Injectable} from "@angular/core";
import {deepCopy} from "../util/deep-copy";
import {Md5} from "../service/md5.service";


export interface RegistrationFormIs {
    name: string;
    pass: string;
    repeatPass: string
}

@Injectable()
export class RegistrationService {
    private socket: any;

    constructor(private io: Io, private md5: Md5) {
        this.socket = io.socket;
    }

    onRegister(data:  {pass: string, name: string} ): Promise<{result:string, message: string}> {

        return this.socket.$get('onRegister', data);
    }

}
