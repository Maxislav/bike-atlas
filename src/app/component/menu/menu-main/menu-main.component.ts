import { Component, Injectable } from '@angular/core';
import {MenuService} from "../menu.service";

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
            <li *ngFor="let item of menu" (click)="onSelect(item, $event)">{{item.text}}</li>
        </ul>`,
    styleUrls: ['./menu-main.css'],
   // providers: [MenuService]
})
export class MenuMainComponent{
    menu = MENU;
    constructor(private ms: MenuService){

    }
    onSelect(item, $event){
       //console.log(item);
       this.ms.menuOpen = false
    }
}