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
exports.MyFireBase = void 0;
const autobind_1 = require("../util/autobind");
class MyFireBase {
    constructor(app, util) {
        this.util = util;
        console.log('MyFireBase path /firebase*');
        app.get('/firebase*', this.onFire);
    }
    onFire(req, res, next) {
        let checkSum = "";
        const { token, id: deviceId } = req.query;
        console.log(`token: ${token}`);
        console.log(`deviceId: ${deviceId}`);
        try {
            checkSum = req.query.sum;
        }
        catch (err) {
            console.error(err);
            res.status(500);
            return res.send(err);
        }
        if (checkSum) {
            res.status(200);
            return res.end(checkSum);
        }
        res.status(500);
        return res.send("Check sum is not recognized");
    }
}
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], MyFireBase.prototype, "onFire", null);
exports.MyFireBase = MyFireBase;
//# sourceMappingURL=firebase.js.map