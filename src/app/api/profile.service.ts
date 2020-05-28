import { Injectable } from '@angular/core';
import { Io, SSocket } from 'src/app/service/socket.oi.service';
import { Md5 } from 'src/app/service/md5.service';
import {ToastService} from '../shared-module/toast-module/toast.service';

export interface PassFormIs {
    currentPass: string;
    newPass: string;
    repeatNewPass: string;
}


@Injectable()
export class ProfileService {
    socket: SSocket;

    constructor(private io: Io,
                private toast: ToastService,
                private md5: Md5) {

        this.socket = io.socket;

    }

    updatePass(passForm: PassFormIs): Promise<any> {

        const data: PassFormIs = {
            ...passForm, ...{
                currentPass: this.md5.hash(passForm.currentPass),
                newPass: this.md5.hash(passForm.newPass),
                repeatNewPass: this.md5.hash(passForm.repeatNewPass)
            }
        };

        return this.socket.$get('updatePass', data)
            .catch(err => {
                console.log(err);
            });
    }
}
