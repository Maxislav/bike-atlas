import { Component, Injectable } from '@angular/core';
import {MenuService} from "app/service/menu.service";

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
    selector: 'menu-track',
    template: `<ul>
            <li *ngFor="let item of menu" (click)="onSelect(item, $event)">{{item.text}}</li>
        </ul>`,
    styleUrls: ['./menu-track.css'],
   // providers: [MenuService]
})
export class MenuTrackComponent{
    menu = MENU;
    constructor(private ms: MenuService){

    }
    onSelect(item, $event){

        switch (item.value){
            case 'load':
                this.ms.menuLoadOpen = true;
                break;
            default:
                return null
        }

       // const click =  onclick.bind(this);

        /*switch (item.value){
            case 'load':
                this.ms.menuLoadOpen = true;
               /!* setTimeout(()=>{
                    document.body.addEventListener('click',click)
                },100);*!/
                break;
            default:
                return null
        }
*/

       //this.ms.menuOpen = false;

      /*function onclick(e){
          if(e.target.tagName!='INPUT'){
              document.body.removeEventListener('click',click);
              this.ms.menuLoadOpen = false
          }

      }*/

    }
}