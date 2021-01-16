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
class Device extends ProtoData {
    constructor(socket, util, logger) {
        super(socket, util);
        this.socket = socket;
        this.util = util;
        this.logger = logger;
        this.socket.$get('onDevices', this.onDevices);
        this.socket.$get('onAddDevice', this.onAddDevice);
        this.socket.$get('onDelDevice', this.onDelDevice);
        this.socket.on('emitLastPosition', this.emitLastPosition);
        //socket.on('onDelDevice', this.onDelDevice.bind(this));
        const onAddDeviceImage = this.onAddDeviceImage.bind(this);
        socket.$get('onAddDeviceImage', onAddDeviceImage);
    }
    onAddDeviceImage(request, response) {
        const device_key = request.data.deviceKey;
        const image = request.data.image;
        const util = this.util;
        return util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return util.getDeviceByUserId(user_id);
        })
            .then((rows) => {
            return !!rows.find(item => item.device_key === device_key);
        })
            .then((bool) => {
            if (bool) {
                return this.util.upadetDeviceImage(device_key, image);
            }
            else {
                response.end({
                    error: 'Device not found for current user'
                });
                throw new Error('Device not found for current user');
            }
        })
            .then(() => {
            response.end({
                result: 'ok'
            });
        })
            .catch(err => {
            response.end({
                error: err.toString()
            });
            console.error(err);
        });
    }
    onDevices(req, res) {
        const util = this.util;
        return util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return util.getDeviceByUserId(user_id)
                .then((rows) => {
                res.end({
                    result: 'ok',
                    devices: rows
                });
            });
        })
            .catch((err) => {
            res.end({
                result: false,
                error: err.toString()
            });
            console.error('error getDevice->', err);
        });
    }
    emitLastPosition() {
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            return this.util.getDeviceByUserId(user_id)
                .then((rows) => {
                return Promise.all(rows.map(row => {
                    return this.util.getLastPosition(row.device_key)
                        .then((row) => {
                        if (row) {
                            const loggerRow = {
                                alt: 0,
                                azimuth: 0,
                                date: row.date,
                                device_key: row.device_key,
                                id: row.id,
                                lng: row.lng,
                                lat: row.lat,
                                speed: row.speed,
                                src: row.src,
                                type: row.type,
                                bs: row.bs,
                                accuracy: row.accuracy,
                                batt: row.batt
                            };
                            this.socket.emit('log', loggerRow);
                        }
                        return Promise.resolve(row);
                    });
                }));
            });
        })
            .catch(err => {
            console.log(err);
        });
    }
    onAddDevice(req, res) {
        const device = req.data;
        const util = this.util;
        util.getDeviceByKey(device.id)
            .then(rows => {
            if (rows && rows.length) {
                res.end({
                    result: false,
                    error: 'Device exist'
                });
                return false;
            }
            else {
                return true;
            }
        })
            .then(d => {
            if (d) {
                return util.addDeviceBySocketId(this.socket.id, device)
                    .then(d => {
                    res.end({
                        result: 'ok',
                        error: null
                    });
                });
            }
        })
            .catch(err => {
            res.end({
                error: err.toString()
            });
        });
    }
    onDelDevice(req, res) {
        const device = req.data;
        console.log('onDelDevice->', device.device_key);
        const util = this.util;
        util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
            util.delDeviceByUserDeviceKey(user_id, device.device_key)
                .then((d) => {
                res.end({
                    result: 'ok'
                });
            })
                .catch(err => {
                res.end({
                    result: false,
                    message: err
                });
                console.error('Error onDelDevice->', err);
            });
        });
    }
}
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Device.prototype, "onDevices", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Device.prototype, "emitLastPosition", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Device.prototype, "onAddDevice", null);
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], Device.prototype, "onDelDevice", null);
module.exports = Device;
//# sourceMappingURL=device.js.map