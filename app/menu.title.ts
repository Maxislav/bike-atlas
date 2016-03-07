import {Component} from 'angular2/core';
import {ServiceMenu} from './services/service.menu';

@Component({
    selector: '.root-head',
    templateUrl: 'app/template/menu.html',
})
export class Menu {
    userName:string;
    serviceMenu: ServiceMenu;

    constructor(serviceMenu: ServiceMenu) {
        this.serviceMenu = serviceMenu;
        setTimeout(this.setName.bind(this), 1000)
    }

    setName() {
        this.userName = 'Public'
    }

    clicked() {
        this.serviceMenu.show = !this.serviceMenu.show;
    }
}