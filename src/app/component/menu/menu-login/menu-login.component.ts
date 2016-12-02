import { Component } from '@angular/core';
import {MenuService} from "app/service/menu.service";


@Component({
    moduleId: module.id,
    selector: 'menu-login',
    template: '<div (click)="onClick($event)" ><label>Имя</label><input type="text"><label>Пароль</label><input type="password"></div>',
    styleUrls: ['./menu-login.css'],
    // providers: [MenuService]
})
export class MenuLoginComponent{
    onClick(e){
        e.stopPropagation()
        e.preventDefault()
    }
}