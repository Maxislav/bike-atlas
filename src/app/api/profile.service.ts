import { Injectable } from '@angular/core';
import { ToastService } from 'src/app/component/toast/toast.component';
import { Io, SSocket } from 'src/app/service/socket.oi.service';

export interface PassFormIs {
    currentPass: string;
    newPass: string;
    repeatNewPass: string;
}


@Injectable()
export class ProfileService {
    socket: SSocket;

    constructor(private io: Io,
                private toast: ToastService){

        this.socket = io.socket;

    }

    updatePass(passForm: PassFormIs): Promise<any>{
        return  this.socket.$get('updatePass', {})
    }
}
