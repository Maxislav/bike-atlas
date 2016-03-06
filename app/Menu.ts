import {Component} from 'angular2/core';

@Component({
    selector: '.root-head',
    templateUrl: 'app/template/menu.html',
})
export class Menu {
    show:boolean = false;
    userName:string;

    constructor() {
        setTimeout(this.setName.bind(this), 1000)
    }

    setName() {
        this.userName = 'Public'
    }

    clicked() {
        this.show = !this.show;
    }
}