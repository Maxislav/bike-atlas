import {Component} from '@angular/core';
//import { Rp } from '@angular/core';
import {MenuService} from "app/service/menu.service";
import {Router} from "@angular/router";
import {Io} from "../../../service/socket.oi.service";
import {Md5} from "../../../service/md5.service";
import {LocalStorage} from "../../../service/local-storage.service";
import {AuthService} from "../../../service/auth.service";
import {ToastService} from "../../toast/toast.component";
import {DeviceService} from "../../../service/device.service";
import {LoginService} from "../../../service/login.service";
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

    constructor(private router: Router,
                private ms: MenuService,
                private  io: Io,
                private md5: Md5,
                private ls: LocalStorage,
                public as: AuthService,
                private ds: DeviceService,
                private ts: ToastService,
                private loginService: LoginService) {
        this.socket = io.socket;
    }

    goToReg() {
        this.router.navigate(['/auth/map/registration']);
        this.ms.menuOpenLogin = false
    }

    onEnter(e) {
        this.loginService
            .onEnter({
                name: this.name,
                pass: this.md5.hash(this.pass)
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