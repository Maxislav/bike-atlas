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
const ProtoData = require("./proto-data");
const autobind_1 = require("../util/autobind");
class OnMyMarker extends ProtoData {
    constructor(socket, util) {
        super(socket, util);
        this.socket.$get('getMarkerList', this.getMarkerList);
        this.socket.on('saveMyMarker', this.saveMyMarker.bind(this, 'saveMyMarker'));
        this.socket.on('removeMyMarker', this.removeMyMarker.bind(this, 'removeMyMarker'));
    }
    getMarkerList(req, res) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then((user_id) => {
            return this.util.getMyMarker(user_id);
        })
            .then(rows => {
            res.end(rows);
        });
    }
    saveMyMarker(eName, data) {
        console.log('saveMyMarker ->  ', data);
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return this.util.saveMyMarker(user_id, data);
        })
            .then(res => {
            this.socket.emit(eName, Object.assign({}, data, { id: res.insertId }));
        })
            .catch(err => {
            console.log('Err save marker', err);
        });
    }
    /**
     * @param {string} eName
     * @param {{id: number}} data
     */
    removeMyMarker(eName, data) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return this.util.removeMyMarker(user_id, data.id);
        })
            .then(() => {
            this.socket.emit(eName, { result: 'ok' });
        })
            .catch((e) => {
            this.socket.emit(eName, { error: e });
        });
    }
}
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnMyMarker.prototype, "getMarkerList", null);
exports.OnMyMarker = OnMyMarker;
//module.exports = OnMyMarker;
//# sourceMappingURL=on-my-marker.js.map