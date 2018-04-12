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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const socket_io_1 = __importDefault(require("socket/socket.io"));
const aes_cript_1 = require("./aes-cript");
let Io = class Io {
    constructor() {
        if (window.location.hostname.match(/github\.io/)) {
            this._socket = socket_io_1.default("http://178.62.44.54:8081");
        }
        else {
            this._socket = socket_io_1.default("http://" + window.location.hostname + ":8081");
        }
        this._socket.$emit = (name, data) => {
            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject('Error by timeout name->' + name);
                }, 30000);
                const response = (d) => {
                    clearTimeout(timeout);
                    this.socket.off(name, response);
                    resolve(d);
                };
                this.socket.on(name, response);
                this.socket.emit(name, data);
            });
        };
        this._socket.on('news', (d) => {
            //console.log(d,'klklttewefewfwe')
        });
        this._socket.$encrypt = (name, data) => {
            const aes = new aes_cript_1.Aes(16);
            const mess = JSON.stringify(data);
            return this._socket
                .$emit(name, {
                n: 0,
                byteArr: Array.from(aes.encodeTextToByte(mess))
            })
                .then(d => {
                const enc2 = new Uint8Array(d.byteArr);
                return this._socket.$emit(name, {
                    n: 1,
                    byteArr: Array.from(aes.decodeByteToByte(enc2)),
                });
            });
        };
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
