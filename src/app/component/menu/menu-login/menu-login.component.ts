import {Component} from '@angular/core';
//import { Rp } from '@angular/core';
import {MenuService} from "app/service/menu.service";
import {Router} from "@angular/router";
import {Io} from "../../../service/socket.oi.service";
import {Md5} from "../../../service/md5.service";
import {LocalStorage} from "../../../service/local-storage.service";
import {AuthService} from "../../../service/auth.service";
import {ToastService} from "../../toast/toast.component";
//import {RouterLink} from "@angular/router-deprecated";


@Component({
    moduleId: module.id,
    selector: 'menu-login',
    //directives: [RouterLink],
    templateUrl: './menu-login.component.html',
    styleUrls: ['./menu-login.css'],
    // providers: [MenuService]
})
export class MenuLoginComponent {
    private name: string;
    private pass: string;
    private socket;

    constructor(private router: Router, private ms: MenuService, private  io: Io, private md5: Md5, private ls: LocalStorage, public as: AuthService, private ts: ToastService) {
        this.socket = io.socket;
    }

    goToReg() {
        this.router.navigate(['/auth/map/registration']);
        this.ms.menuOpenLogin = false
    }

    onEnter(e) {
        this.socket
            .$emit('onEnter', {
                name: this.name,
                pass: this.md5.hash(this.pass)
            })
            .then(d => {
                console.log(d);
                switch (d.result) {
                    case 'ok':
                        this.ls.userKey = d.hash;
                        this.as.userName = d.name;
                        break;
                    case false:
                        this.ts.show({
                            type: 'warning',
                            text: 'Невеное имя пользователя или пароль'
                        })

                }
            });
    }

    onExit(e) {
        this.socket
            .$emit('onExit', {
                hash: this.ls.userKey
            })
            .then(d => {
                if (d.result == 'ok') {
                    this.ls.userKey = null;
                    this.as.userName = null;
                }
            })


    }

    goDevice() {
        this.router.navigate(['/auth/map/device']);
        this.ms.menuOpenLogin = false
    }
}