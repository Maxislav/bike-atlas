import {Component} from '@angular/core';
//import { Rp } from '@angular/core';
import {MenuService} from "app/service/menu.service";
import {Router} from "@angular/router";
import {Io} from "../../../service/socket.oi.service";
import {Md5} from "../../../service/md5.service";
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
    private name:string;
    private pass:string;
    private socket;

    constructor(private router:Router, private ms:MenuService, private  io:Io, private md5:Md5) {
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
            .then(d=> {
                console.log(d)
            })
        //console.log(this.name, this.md5.hash(this.pass))
    }
}