import { Injectable } from '@angular/core';
import * as io from 'socket.io-client/dist/socket.io.js';
import { Aes } from './aes-cript';
import { Deferred } from '../util/deferred';

interface Socket {
    emit: Function;
    $emit: Function;
    $encrypt: Function;
    $decrypt: Function;
    on: Function;
    off: Function;
}


class Listener {
    public resolve: Function;
    public timeout: number;

    constructor(private name: string, private sSocket: SSocket) {
        const response = this.response.bind(this);
        sSocket.on(name, response);
    }

    response(d: any) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.resolve(d);
    }
}

class GetListener {
    private static hashKeys: Array<string>;
    private readonly hashMap: { [hash: string]: { timeout: number, deferred: Deferred<any> } };

    constructor(public name, private sSocket: SSocket) {
        const response = this.response.bind(this);
        this.hashMap = {};
        sSocket.on(name, response);
    }

    response(d: { hash: string, data: any }) {
        const {data, hash} = d;
        const {deferred, timeout} = this.hashMap[hash];
        clearTimeout(timeout);
        deferred.resolve(data);
        delete this.hashMap[hash];
        this.delHash(hash);
    }

    emit(data: any) {
        const hash = this.getHash();
        const deferred = new Deferred();
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

    private getHash() {
        const $possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let hash = '';
        for (let i = 0; i < 32; i++) {
            hash += '' + $possible[GetListener.getRandom(0, 61, true)];
        }
        if (-1 < GetListener.hashKeys.indexOf(hash)) {
            return this.getHash();
        } else {
            return hash;
        }
    }

    private delHash(hash: string) {
        const index = GetListener.hashKeys.indexOf(hash);
        if (-1 < index) {
            GetListener.hashKeys.splice(index, 1);
        }
    }

    private static getRandom(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand);
        }
        return rand;
    }

}


class SSocket {
    emit: Function;
    $decrypt: Function;
    on: (name: string, callback: Function) => {};
    off: Function;

    listenerHashMap: { [name: string]: Listener };

    getListenerHashMap: { [name: string]: GetListener };

    constructor(uri: string) {
        Object.setPrototypeOf(this.constructor.prototype, io(uri));
        this.listenerHashMap = {};
    }

    $get(name: string, data: any): Promise<any> {
        if (!this.getListenerHashMap[name]) {
            this.getListenerHashMap[name] = new GetListener(name, this);
        }
        return this.getListenerHashMap[name].emit(data);
    }


    $emit(name: string, data: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            this.listenerHashMap[name] = this.listenerHashMap[name] || new Listener(name, this);
            this.listenerHashMap[name].resolve = resolve;
            this.listenerHashMap[name].timeout = setTimeout(() => {
                reject('Error by timeout name->' + name);
            }, 30000);
            this.emit(name, data);
        });
    }

    $encrypt(name: string, data: any): Promise<any> {
        const aes = new Aes(16);
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


@Injectable()
export class Io {
    private readonly _socket: SSocket;
    private readonly url: string;

    constructor() {

        if (window.location.hostname.match(/github\.io/)) {
            this.url = 'http://178.62.44.54:8081';
        } else {
            this.url = 'http://' + window.location.hostname + ':8081';
        }
        this._socket = new SSocket(this.url);


    }

    public get socket(): SSocket {
        return this._socket;
    }


}