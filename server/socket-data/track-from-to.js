"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const R = require('ramda');
const distance_1 = require("../util/distance");
const lngLat_1 = require("../util/lngLat");
const proto_data_1 = require("./proto-data");
class TrackFromTo extends proto_data_1.ProtoData {
    constructor(socket, util) {
        super(socket, util);
        //socket.on('trackFromTo', this.trackFromTo.bind(this, 'trackFromTo'));
        //socket.on('getLastDate', this.getLastDate.bind(this, 'getLastDate'));
        socket.on('delPoints', this.delPoints.bind(this, 'delPoints'));
        socket.on('downloadTrack', this.downloadTrack.bind(this, 'downloadTrack'));
        const getLastDate = this.getLastDate.bind(this);
        const getLastDeviceDate = this.getLastDeviceDate.bind(this);
        const trackDeviceFromTo = this.trackDeviceFromTo.bind(this);
        socket.$get('getLastDate', getLastDate);
        socket.$get('getLastDeviceDate', getLastDeviceDate);
        socket.$get('trackDeviceFromTo', trackDeviceFromTo);
    }
    getLastDeviceDate(req, res) {
        const device_key = req.data;
        let _userId;
        this.getUserId()
            .then(userId => {
            _userId = userId;
            return this.util.getDeviceByUserId(userId);
        })
            .then(devices => {
            return devices.some(device => {
                return device.device_key === device_key;
            });
        })
            .then((isExist) => {
            if (isExist) {
                return this.util.getLastDateTrack(device_key);
            }
            else {
                //console.error('->Device is not registered on this user');
                res.end({
                    error: 'Device is not registered on this user'
                });
                throw new Error('->Device is not registered on this user');
            }
        })
            .then(row => {
            res.end({
                date: row.date
            });
        })
            .catch(err => {
            console.error(err);
        });
    }
    trackDeviceFromTo(req, res) {
        const { from, to, device_key } = req.data;
        let _userId;
        this.getUserId()
            .then(userId => {
            _userId = userId;
            return this.util.getDeviceByUserId(userId);
        })
            .then(devices => {
            return devices.find(device => {
                return device.device_key === device_key;
            });
        })
            .then((device) => {
            if (device) {
                return this.util.getTrackFromTo(device_key, from, to)
                    .then((rows) => {
                    let points = TrackFromTo._clearParkingPoints(rows);
                    points = TrackFromTo._clearInvalidPoint(points);
                    res.end({
                        result: 'ok',
                        list: [{ userId: device.user_id, name: device.name, points: points }]
                    });
                });
            }
            else {
                res.end({
                    error: 'Device is not registered on this user'
                });
                throw new Error('->Device is not registered on this user');
            }
        })
            /*.then(rows => {
                //result: 'ok',
                const points = TrackFromTo._clearTrashPoints(new Points(...rows));

            })*/
            .catch(err => {
            console.error(err);
        });
    }
    getLastDate(req, res) {
        let _userId;
        this.getUserId()
            .then(userId => {
            _userId = userId;
            return this.util.getDeviceByUserId(userId);
        })
            .then(devices => {
            return Promise.all(devices.map(device => {
                return this.util.getLastDateTrack(device.device_key)
                    .then(res => {
                    return {
                        date: res.date,
                        device_key: device.device_key
                    };
                });
            }));
        })
            .then(rows => {
            res.end(rows);
        })
            .catch(err => {
            console.error(`Error get last date -> `, err);
        });
    }
    trackFromTo(eName, data) {
        Promise.all([
            this.getUserId(),
            this.getFriendsIds()
        ])
            .then(([userId, friendIds]) => {
            const ids = [].concat([userId]).concat(friendIds);
            return this.util.detDeviceByUserId(ids.join(','));
        })
            .then(devices => {
            const list = [];
            return Promise.all(devices.map(device => {
                return this.util.getTrackFromTo(device.device_key, data.from, data.to)
                    .then((rows) => {
                    let points = rows;
                    try {
                        points = TrackFromTo._clearParkingPoints(rows);
                    }
                    catch (e) {
                        points = rows;
                    }
                    //const
                    list.push({ userId: device.user_id, name: device.name, points: points });
                    return rows;
                });
            }))
                .then(() => {
                return list;
            });
        })
            .then(list => {
            this.socket.emit(eName, {
                result: 'ok',
                list: list
            });
        })
            .catch(err => {
            console.error('Error trackFromTo ->', err);
        });
    }
    delPoints(eName, points) {
        this.getUserId()
            .then(userId => {
            return this.util.getDeviceByUserId(userId);
        })
            .then(devices => {
            const deviceKeys = R.pluck('device_key')(devices);
            const arrPromise = [];
            points.forEach(pointId => {
                arrPromise.push(this.util.getDeviceKeyByPointId(pointId)
                    .then(device => {
                    return deviceKeys.indexOf(device.device_key);
                }));
            });
            return Promise.all(arrPromise);
        })
            .then(arr => {
            if (arr.find((a) => a == -1)) {
                return Promise.reject('no found link device');
            }
            else {
                return this.util.delPointsByIds(points.join(','));
            }
        })
            .then(rows => {
            this.socket.emit(eName, {
                result: 'ok'
            });
        })
            .catch(err => {
            console.error('Error delPoints ->', err);
            this.socket.emit(eName, {
                result: false,
                message: err
            });
        });
    }
    downloadTrack(eName, points) {
        this.getUserId()
            .then(userId => {
            return this.util.getDeviceByUserId(userId);
        })
            .then(devices => {
            if (!devices.length) {
                this.socket.emit(eName, {
                    result: false,
                    message: 'devices empty'
                });
                return Promise.reject('devices empty');
            }
            else {
                return devices[0].device_key;
            }
        })
            .then(deviceKey => {
            return Promise.all(points.map(point => {
                return this.util.downloadTrack(deviceKey, point);
            }));
        })
            .then(dd => {
            this.socket.emit(eName, {
                result: 'ok'
            });
        })
            .catch(err => {
            if (err) {
                this.socket.emit(eName, {
                    result: false,
                    message: err
                });
            }
            console.log('Error downloadTrack->', err);
        });
    }
    static _clearInvalidPoint(points) {
        for (let i = 0; i < points.length - 2; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2];
            const dist1 = distance_1.distance(lngLat_1.LngLat.fromObject(p1), lngLat_1.LngLat.fromObject(p2));
            const dist2 = distance_1.distance(lngLat_1.LngLat.fromObject(p2), lngLat_1.LngLat.fromObject(p3));
            if (1 < dist1 && 1 < dist2) {
                points.splice(i + 1, 1);
                return TrackFromTo._clearInvalidPoint(points);
            }
        }
        return points;
    }
    static _clearParkingPoints(points, k) {
        let i = k || 0;
        const point1 = points[i];
        if (!point1 || k == points.length) {
            return points;
        }
        else if (0.1 < point1.speed) {
            i++;
            return TrackFromTo._clearParkingPoints(points, i);
        }
        else {
            const arrForSum = [];
            let i2 = i;
            while (i2 < points.length - 1) {
                const point2 = points[i2 + 1];
                if (distance_1.distance(new lngLat_1.LngLat(point1.lng, point1.lat), lngLat_1.LngLat.fromArray([point2.lng, point2.lat])) < 0.05) {
                    if (!arrForSum.length)
                        arrForSum.push(point1);
                    arrForSum.push(point2);
                }
                i2++;
            }
            arrForSum.forEach(point => {
                const indexForDel = points.indexOf(point);
                points[indexForDel] = null;
            });
            points = points.filter(it => it);
            i++;
            return TrackFromTo._clearParkingPoints(points, i);
        }
    }
    checkPointExist() {
    }
}
module.exports = TrackFromTo;
//# sourceMappingURL=track-from-to.js.map