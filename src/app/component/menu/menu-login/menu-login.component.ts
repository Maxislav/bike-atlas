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
import {LogService} from "../../../service/log.service";
import {FriendsService} from "../../../service/friends.service";
//import {RouterLink} from "@angular/router-deprecated";


@Component({
    moduleId: module.id,
    selector: 'menu-login',
    //directives: [RouterLink],
    templateUrl: './menu-login.component.html',
    styleUrls: ['./menu-login.css'],
     //providers: [MenuService]
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
                private logService: LogService,
                private friend: FriendsService,
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

    goToProfile(){
        this.router.navigate(['/auth/map/profile']);
        this.ms.menuOpenLogin = false
    }

    onExit(e) {
        this.loginService.onExit(e);
    }
    goToFriends(){
        this.ms.menuOpenLogin = false
        this.router.navigate(['/auth/map/friends']);

    }

    goDevice() {
        this.router.navigate(['/auth/map/device']);
        this.ms.menuOpenLogin = false
    }
}