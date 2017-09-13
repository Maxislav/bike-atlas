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
const core_1 = require("@angular/core");
const jsonParse = (str) => {
    let json;
    try {
        json = JSON.parse(str);
    }
    catch (err) {
        console.warn('Error parse json from localStorage');
    }
    return json || {};
};
class Storage {
    constructor(name) {
        this.storageKey = Storage.prefix + '-' + name;
    }
    setItem(name, value) {
        const json = this.json;
        json[name] = value;
        window.localStorage.setItem(this.storageKey, JSON.stringify(json));
        // this._doChange && this._doChange(json);
        // this.emit(name, value);
        return value;
    }
    /**
     * @param {string} name
     * @return {number|string}
     */
    getItem(name) {
        return this.json[name];
    }
    removeItem(name) {
        const json = this.json;
        delete json[name];
        window.localStorage.setItem(this.storageKey, JSON.stringify(json));
    }
    get json() {
        return jsonParse(window.localStorage.getItem(this.storageKey));
    }
}
Storage.prefix = 'ba';
let LocalStorageBa = class LocalStorageBa {
    constructor() {
        this.storages = {};
    }
    create(name) {
        const storages = this.storages;
        if (storages[name]) {
            return storages[name];
        }
        return storages[name] = new Storage(name);
    }
};
LocalStorageBa = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [])
], LocalStorageBa);
exports.LocalStorageBa = LocalStorageBa;
//# sourceMappingURL=local-storage-ba.service.js.map