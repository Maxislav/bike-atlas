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
exports.OnRegist = void 0;
const autobind_1 = require("../util/autobind");
const proto_data_1 = require("./proto-data");
class OnRegist extends proto_data_1.ProtoData {
    constructor(socket, util, logger) {
        super(socket, util);
        this.socket = socket;
        this.util = util;
        this.logger = logger;
        socket.on('onRegist', this.onRegist);
        this.socket.$get('updatePass', this.updatePass);
        this.socket.$get('onRegister', this.onRegister);
    }
    onRegister(req, res) {
        console.log(req.data);
        const d = req.data;
        this.util.onRegist(d)
            .then(d => {
            if (d && d.result == 'ok') {
                res.end({
                    result: 'success',
                    error: null
                });
            }
            else {
                res.end(d);
            }
        }, err => {
            console.error(err);
        })
            .catch((err) => {
            console.error('Cache onRegist', err);
            res.end({
                result: false,
                error: err.toString()
            });
            //this.socket.emit('onRegist', {result: false, status: 500, message: err});
        });
        /* res.end({
             result: 'ok',
             error: null
         })*/
    }
    onRegist(d) {
        this.util.onRegist(d)
            .then(d => {
            if (d && d.result == 'ok') {
                this.socket.emit('onRegist', {
                    result: 'ok',
                    message: null
                });
            }
            else {
                this.socket.emit('onRegist', d);
            }
        }, err => {
            console.error(err);
        })
            .catch((err) => {
            console.error('Cache onRegist', err);
            this.socket.emit('onRegist', { result: false, status: 500, message: err });
        });
    }
    updatePass(req, res) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then((user_id) => {
            return this.util.getUserById(user_id);
        })
            .then(user => {
            if (req.data.currentPass === user.pass) {
                return this.util.updatePassword(user.id, req.data.newPass, this.socket.id)
                    .then((rows) => {
                    res.end({
                        result: 'ok',
                        error: null,
                        data: rows
                    });
                });
            }
            else {
                res.end({
                    result: 'CURRENT_PASS_NOT_MATCH',
                    error: 'Current password does not match',
                });
            }
        })
            .catch((err) => {
            res.end({
                result: 'FAIL',
                error: err.toString()
            });
        });
    }
    updatePassSql() {
    }
}
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnRegist.prototype, "onRegister", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OnRegist.prototype, "onRegist", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnRegist.prototype, "updatePass", null);
exports.OnRegist = OnRegist;
//# sourceMappingURL=on-regist.js.map