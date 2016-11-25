/**
 * Created by maxislav on 22.11.16.
 */
import { Component, Injectable } from '@angular/core';
import {MenuMainComponent} from './menu-main/menu-main.component'



@Injectable()
export class MenuService{

    private _menuOpen: boolean;

    constructor(){
        this._menuOpen = false
    }
    get menuOpen():boolean {
        return this._menuOpen;
    }
    set menuOpen(value:boolean) {
        this._menuOpen = value;
    }
}


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
        this.ms.menuOpen = !this.ms.menuOpen;
    }

    //menuOpen: this.ms.menuOpe
}
