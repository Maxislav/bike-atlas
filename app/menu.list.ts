/**
 * Created by Администратор on 3/7/16.
 */
import {Component} from 'angular2/core';
import {ServiceMenu} from './services/service.menu';
@Component({
    selector: '.menu-list',
    templateUrl: 'app/template/menu-list.html',
})

export class MenuList{
    serviceMenu:ServiceMenu;
    constructor(serviceMenu:ServiceMenu){
        this.serviceMenu = serviceMenu
    }
}