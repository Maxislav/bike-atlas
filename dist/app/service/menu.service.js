"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by maxislav on 25.11.16.
 */
const core_1 = require('@angular/core');
let MenuService = class MenuService {
    constructor() {
        this._menuOpen = false;
        this.menuOpenLogin = false;
        this._menuDevice = false;
        this._menuAthlete = false;
    }
    get menuAthlete() {
        return this._menuAthlete;
    }
    set menuAthlete(value) {
        const click = onclick.bind(this);
        if (value) {
            setTimeout(() => {
                document.body.addEventListener('click', click);
            }, 100);
        }
        else {
            document.body.removeEventListener('click', click);
        }
        function onclick(e) {
            document.body.removeEventListener('click', click);
            this.menuAthlete = false;
        }
        this._menuAthlete = value;
    }
    get menuOpen() {
        return this._menuOpen;
    }
    set menuOpen(value) {
        const click = onclick.bind(this);
        if (value) {
            setTimeout(() => {
                document.body.addEventListener('click', click);
            }, 100);
        }
        else {
            document.body.removeEventListener('click', click);
        }
        function onclick(e) {
            document.body.removeEventListener('click', click);
            this.menuOpen = false;
        }
        this._menuOpen = value;
    }
    get menuOpenLogin() {
        return this._menuOpenLogin;
    }
    set menuOpenLogin(value) {
        const click = onclick.bind(this);
        if (value) {
            setTimeout(() => {
                document.body.addEventListener('click', click);
            }, 100);
        }
        else {
            document.body.removeEventListener('click', click);
        }
        function onclick(e) {
            document.body.removeEventListener('click', click);
            this.menuOpenLogin = false;
        }
        this._menuOpenLogin = value;
    }
};
MenuService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [])
], MenuService);
exports.MenuService = MenuService;
//# sourceMappingURL=menu.service.js.map