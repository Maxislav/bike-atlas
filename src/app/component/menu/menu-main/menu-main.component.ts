import { Component } from '@angular/core';
import {MenuComponent} from '../menu.component';

class Item {
    text: string;
    value: string;
}

const MENU: Item[] = [
    {
        value: 'load',
        text: "Загрузить"
    } ,
    {
        value: 'view',
        text: "Просмотреть"
    }
];

@Component({
    moduleId: module.id,
    selector: 'menu-main',
    template: `<ul>
            <li *ngFor="let item of menu" (click)="onSelect(item)">{{item.text}}</li>
        </ul>`,
    styleUrls: ['./menu-main.css']
})
export class MenuMainComponent{
    menu = MENU;
    constructor(){

    }
    onSelect(item){
        console.log(item)
    }
}