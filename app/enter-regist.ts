/**
 * Created by Администратор on 3/8/16.
 */
import {Component} from 'angular2/core';
import {ServiceMenu} from './services/service.menu';
@Component({
    selector: '.enter-regist',
    templateUrl: 'app/template/enter-regist.html'
})
export class EnterRegist{
    serviceMenu:ServiceMenu;
    constructor(serviceMenu:ServiceMenu){
        this.serviceMenu = serviceMenu
    }

    onCancel(){
        this.serviceMenu.enterRegistShow = false;
    }
}