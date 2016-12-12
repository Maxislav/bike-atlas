import { Component } from '@angular/core';
//import { Rp } from '@angular/core';
import {MenuService} from "app/service/menu.service";
import {Router} from "@angular/router";
//import {RouterLink} from "@angular/router-deprecated";


@Component({
    moduleId: module.id,
    selector: 'menu-login',
    //directives: [RouterLink],
    templateUrl: './menu-login.component.html',
    styleUrls: ['./menu-login.css'],
    // providers: [MenuService]
})
export class MenuLoginComponent{
    constructor(private router: Router, private ms: MenuService){

    }
    goToReg(){
        this.router.navigate(['/auth/map/registration']);
        this.ms.menuOpenLogin = false
    }
}