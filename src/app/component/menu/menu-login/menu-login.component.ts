import {Component} from '@angular/core';
import {MenuService} from "../../../service/menu.service";
import {Router} from "@angular/router";
import {Io} from "../../../service/socket.oi.service";
import {Md5} from "../../../service/md5.service";
import {LocalStorage} from "../../../service/local-storage.service";
import {AuthService} from "../../../service/auth.service";
import {DeviceService} from "../../../service/device.service";
import {FriendsService} from "../../../api/friends.service";
import { User, UserService } from '../../../service/main.user.service';
import {ToastService} from '../../../shared-module/toast-module/toast.service';

@Component({
    selector: 'menu-login',
    templateUrl: './menu-login.component.html',
    styleUrls: ['./menu-login.less'],
})
export class MenuLoginComponent {
    private name: string;
    private pass: string;
    private socket;
    public user: User;

    constructor(private router: Router,
                private ms: MenuService,
                private  io: Io,
                private md5: Md5,
                private ls: LocalStorage,
                private authService: AuthService,
                private ds: DeviceService,
                private ts: ToastService,
                private userService: UserService,
                private friend: FriendsService,
    ) {
        this.socket = io.socket;
        this.user = userService.getUser()
    }



    goToReg() {
        this.router.navigate(['/auth/map/registration']);
        this.ms.menuOpenLogin = false
    }
    goToPrivateArea(){
        this.router.navigate(['/auth/map/privatearea']);
        this.ms.menuOpenLogin = false
    }


    onEnter(e?: MouseEvent) {
        e && e.preventDefault();
        console.log(this.pass);
        this.authService.onEnter({
            name: this.name,
            pass: this.md5.hash(this.pass)
        })

    }


    goToProfile(){
        this.router.navigate(['/auth/map/profile']);
        this.ms.menuOpenLogin = false
    }

    onExit(e) {
        this.authService.onExit(e);
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
