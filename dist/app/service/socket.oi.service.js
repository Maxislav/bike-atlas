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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const io = require("socket.io-client/dist/socket.io.js");
const aes_cript_1 = require("./aes-cript");
const deferred_1 = require("../util/deferred");
class Listener {
    constructor(name, sSocket) {
        this.name = name;
        this.sSocket = sSocket;
        const response = this.response.bind(this);
        sSocket.on(name, response);
    }
    response(d) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.resolve(d);
    }
}
class GetListener {
    constructor(name, sSocket) {
        this.name = name;
        this.sSocket = sSocket;
        const response = this.response.bind(this);
        this.hashMap = {};
        sSocket.on(name, response);
    }
    response(d) {
        const { data, hash } = d;
        const { deferred, timeout } = this.hashMap[hash];
        clearTimeout(timeout);
        deferred.resolve(data);
        delete this.hashMap[hash];
        this.delHash(hash);
    }
    emit(data) {
        const hash = this.getHash();
        const deferred = new deferred_1.Deferred();
        const timeout = setTimeout(() => {
            delete this.hashMap[hash];
            this.delHash(hash);
            deferred.reject('Error by timeout name->' + name);
        }, 10000);
        this.hashMap[hash] = {
            timeout,
            deferred
        };
        this.sSocket.emit(this.name, {
            hash: hash,
            data: data
        });
        return deferred.promise;
    }
    getHash() {
        const $possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let hash = '';
        for (let i = 0; i < 32; i++) {
            hash += '' + $possible[GetListener.getRandom(0, 61, true)];
        }
        if (-1 < GetListener.hashKeys.indexOf(hash)) {
            return this.getHash();
        }
        else {
            return hash;
        }
    }
    delHash(hash) {
        const index = GetListener.hashKeys.indexOf(hash);
        if (-1 < index) {
            GetListener.hashKeys.splice(index, 1);
        }
    }
    static getRandom(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand);
        }
        return rand;
    }
}
GetListener.hashKeys = [];
class SSocket {
    constructor(uri) {
        this.getListenerHashMap = {};
        Object.setPrototypeOf(this.constructor.prototype, io(uri));
        this.listenerHashMap = {};
    }
    $get(name, data) {
        if (!this.getListenerHashMap[name]) {
            this.getListenerHashMap[name] = new GetListener(name, this);
        }
        return this.getListenerHashMap[name].emit(data);
    }
    $emit(name, data) {
        return new Promise((resolve, reject) => {
            this.listenerHashMap[name] = this.listenerHashMap[name] || new Listener(name, this);
            this.listenerHashMap[name].resolve = resolve;
            this.listenerHashMap[name].timeout = setTimeout(() => {
                reject('Error by timeout name->' + name);
            }, 30000);
            this.emit(name, data);
        });
    }
    $encrypt(name, data) {
        const aes = new aes_cript_1.Aes(16);
        const mess = JSON.stringify(data);
        return this
            .$emit(name, {
            n: 0,
            byteArr: Array.from(aes.encodeTextToByte(mess))
        })
            .then(d => {
            const enc2 = new Uint8Array(d.byteArr);
            return this.$emit(name, {
                n: 1,
                byteArr: Array.from(aes.decodeByteToByte(enc2)),
            });
        });
    }
}
let Io = class Io {
    constructor() {
        if (window.location.hostname.match(/github\.io/)) {
            this.url = 'http://178.62.44.54:8081';
        }
        else {
            this.url = 'http://' + window.location.hostname + ':8081';
        }
        this._socket = new SSocket(this.url);
        /*  this._socket.$get('gettt', 'kiska')
              .then(data => {
                  console.log(data)
  
                  return this._socket.$get('gettt', 'kiska2')
              })
              .then(data => {
                  console.log(data)
              })*/
    }
    get socket() {
        return this._socket;
    }
};
Io = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], Io);
exports.Io = Io;
//# sourceMappingURL=socket.oi.service.js.map