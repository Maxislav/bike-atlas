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
exports.MyFirebase = void 0;
const autobind_1 = require("../util/autobind");
const http = require("http");
class MyFirebase {
    constructor(socket, util) {
        this.socket = socket;
        this.util = util;
        socket.$get('update-location', this.onFireBaseRegister);
    }
    onFireBaseRegister(req, res) {
        const data = req.data;
        this.util.getFireBaseToken(req.data.device_key)
            .then(row => {
            if (row) {
                return this.post(row.token);
            }
            else {
                return Promise.reject({
                    message: 'Device is not registered'
                });
            }
        })
            .then((d) => {
            d.toString();
            res.end({
                success: {
                    message: 'ok'
                }
            });
        })
            .catch(e => {
            res.end({
                error: {
                    message: e.message || 'Unknown error',
                    data: JSON.stringify(e)
                }
            });
        });
    }
    post(token) {
        const options = {
            hostname: 'localhost',
            port: 8082,
            path: `/?id=000&token=${token}`,
            method: 'GET',
        };
        return new Promise((res, rej) => {
            const proxyRequest = http.request(options);
            const chunks = [];
            proxyRequest.on('response', function (proxyResponse) {
                proxyResponse.on('data', function (chunk) {
                    chunks.push(chunk);
                });
                proxyResponse.on('end', function () {
                    // res.send(Buffer.concat(chunks))
                    res(Buffer.concat(chunks));
                });
            });
            proxyRequest.on('error', function (err) {
                console.error('MyFirebase error ->', err);
                rej(err);
            });
            proxyRequest.end();
        });
    }
}
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MyFirebase.prototype, "onFireBaseRegister", null);
exports.MyFirebase = MyFirebase;
//# sourceMappingURL=on-firebase.js.map