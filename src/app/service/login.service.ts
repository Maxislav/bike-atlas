import { Injectable } from '@angular/core';
import { Io } from './socket.oi.service';
import { LocalStorage } from './local-storage.service';
import { AuthService } from './auth.service';
import { DeviceService } from './device.service';
import { ToastService } from '../component/toast/toast.component';
import { UserService } from './main.user.service';
import { MyMarkerService } from '../service/my-marker.service';

/**
 * Created by max on 04.01.17.
 */
@Injectable()
export class LoginService {
    private socket: any;

    constructor(private  io: Io,
                private ls: LocalStorage,
                public as: AuthService,
                private ts: ToastService,
                private  deviceService: DeviceService,
                private userService: UserService,
                private  myMarkerService: MyMarkerService
    ) {
        this.socket = io.socket;
    }

    onEnter({name, pass}) {
        return this.socket
            .$emit('onEnter', {
                name: name,
                pass: pass
            })
            .then(this.setHashName.bind(this));

    }


    setHashName(d) {
        console.log(d);
        switch (d.result) {
            case 'ok':
                this.ls.userKey = d.hash;
                this.as.onAuth();
                break;
            case false:
                this.ts.show({
                    type: 'warning',
                    text: 'Невеное имя пользователя или пароль'
                });

        }
    }

    onExit(e: Event) {
        this.socket
            .$emit('onExit', {
                hash: this.ls.userKey
            })
            .then(d => {
                if (d.result == 'ok') {

                    this.ls.userKey = null;
                    this.userService.clearAll();
                    this.deviceService.clearDevices();
                    this.myMarkerService.clearAll();

                }
            });

    }
}