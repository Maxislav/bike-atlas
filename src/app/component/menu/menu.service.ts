/**
 * Created by maxislav on 25.11.16.
 */
import { Injectable } from '@angular/core';
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