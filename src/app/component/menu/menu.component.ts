/**
 * Created by maxislav on 22.11.16.
 */
import { Component, Injectable } from '@angular/core';
import {MenuMainComponent} from './menu-main/menu-main.component'
import any = jasmine.any;
import {MenuService} from "./menu.service";

declare var document: any;



@Component({
    moduleId: module.id,
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    providers: [MenuMainComponent, MenuService]
})
export class MenuComponent{

    public menuOpen: boolean;

    constructor(private ms: MenuService){
        //this.menuOpen = ms.menuOpen
    }
    onOpen(){
        var click =  onclick.bind(this)
        this.ms.menuOpen = !this.ms.menuOpen;
        if(this.ms.menuOpen ){

            setTimeout(()=>{
                document.body.addEventListener('click',click)
            },100)
        }else{
            document.body.removeEventListener('click', click)
        }

        function onclick(e){
            document.body.removeEventListener('click', click)
            this.ms.menuOpen = false
        }

    }

    //menuOpen: this.ms.menuOpe
}
