"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gl520Parser = void 0;
const deferred_1 = require("./deferred");
const base_station_location_1 = require("./base-station-location");
const deep_copy_1 = require("../util/deep-copy");
const MessageType = {
    GTSTR: 0,
    GTLBS: 1,
    GTGSM: 2,
    toString(n) {
        const r = {
            0: 'GTSTR',
            1: 'GTLBS',
            2: 'GTGSM'
        };
        return r[n];
    }
};
class Gl520Parser {
    constructor() {
        this.srcMsg = null;
        this.type = null;
        this.messageType = -1;
        this.pointList = null;
        //private point: Point;
        this.deferred = new deferred_1.Deferred();
        this.baseStationLocation = new base_station_location_1.BaseStationLocation();
    }
    /**
     *
     * @param {string} srcStr
     * @returns {Gl520Parser}
     */
    setSrcData(srcStr) {
        this.srcMsg = srcStr;
        this.setType(srcStr);
        this.parseData();
        return this;
    }
    /**
     * @returns {Promise|Promise<any>}
     */
    getData() {
        return this.deferred.promise;
    }
    /**
     *
     * @returns {*}
     * @private
     */
    parseData() {
        const respData = {
            alt: null,
            lng: null,
            lat: null,
            azimuth: null,
            speed: null,
            date: null,
            src: this.srcMsg
        };
        if (this.messageType === MessageType.GTSTR) {
            const arr = this.srcMsg.split(',');
            const srcDate = arr[15];
            const point = Object.assign(respData, {
                device_key: arr[2],
                id: arr[2],
                speed: arr[10],
                azimuth: arr[11],
                alt: arr[12],
                lng: arr[13],
                lat: arr[14],
                type: this.type,
                accuracy: 0,
                date: new Date(Number(srcDate.slice(0, 4)), Number(srcDate.slice(4, 6)) - 1, Number(srcDate.slice(6, 8)), Number(srcDate.slice(8, 10)), Number(srcDate.slice(10, 12)), Number(srcDate.slice(12, 14)))
            });
            this.deferred.resolve({
                result: 'ok',
                points: [point]
            });
        }
        if (this.messageType === MessageType.GTGSM) {
            const arr = this.convertToMobileCell();
            const group = this.cellGroup(arr);
            const deviceId = this.getDeviceId();
            const date = this.getDate();
            Promise.all(group.map(cell => {
                return this.baseStationLocation.getAverageLatLng(cell)
                    .then((c) => {
                    const arr = cell.cells.map(cc => {
                        return {
                            mnc: cell.mnc,
                            mcc: cell.mcc,
                            lac: cc.lac,
                            cellId: cc.cid,
                            rxLevel: cc.rxLevel
                        };
                    });
                    return Promise.all(arr.map(mobileCell => {
                        return this.baseStationLocation.getLatLng(mobileCell);
                    })).then((bsPointList) => {
                        return Object.assign(Object.assign(Object.assign({}, respData), c), { date: date, device_key: deviceId, id: deviceId, speed: 0, alt: 0, type: 'BS', bs: bsPointList.map(station => {
                                return Object.assign({}, station);
                            }) });
                    });
                });
            }))
                .then((points) => {
                let _points = points;
                return this.deferred.resolve({
                    result: 'ok',
                    points: _points
                });
            });
        }
        else {
            this.deferred.resolve(null);
        }
    }
    cellGroup(cellList, arrCell = []) {
        const cList = deep_copy_1.deepCopy(cellList);
        if (cList.length) {
            const countryNetworkCode = { mcc: cList[0].mcc, mnc: cList[0].mnc };
            const cells = cList.filter(c => {
                return c.mnc === countryNetworkCode.mnc && c.mcc === countryNetworkCode.mcc;
            });
            arrCell.push(Object.assign(Object.assign({}, countryNetworkCode), { cells: cells.map(c => {
                    return {
                        lac: c.lac,
                        cid: c.cellId,
                        rxLevel: c.rxLevel
                    };
                }) }));
            const unList = cList.filter(c => {
                return c.mnc !== countryNetworkCode.mnc || c.mcc !== countryNetworkCode.mcc;
            });
            if (unList.length) {
                return this.cellGroup(unList, arrCell);
            }
        }
        return arrCell;
    }
    getDeviceId() {
        let deviceId;
        const arr = this.srcMsg.split(',');
        if (this.messageType === MessageType.GTSTR) {
            deviceId = arr[2];
        }
        if (this.messageType === MessageType.GTLBS) {
            deviceId = arr[10];
        }
        if (this.messageType === MessageType.GTGSM) {
            deviceId = arr[2];
        }
        return deviceId;
    }
    getDate() {
        const arr = this.srcMsg.split(',');
        let date = new Date();
        if (this.messageType === MessageType.GTLBS) {
            date = this.strToDate(arr[arr.length - 2]);
        }
        if (this.messageType === MessageType.GTGSM) {
            date = this.strToDate(arr[arr.length - 2]);
        }
        return date;
    }
    convertToMobileCell() {
        const mc = {
            mcc: null,
            mnc: null,
            lac: null,
            cellId: null
        };
        const arr = this.srcMsg.split(',');
        let stationsSrc;
        let deviceId = this.getDeviceId();
        let date = this.getDate();
        if (this.messageType === MessageType.GTLBS) {
            stationsSrc = arr.slice(12, arr.length - 2);
        }
        if (this.messageType === MessageType.GTGSM) {
            stationsSrc = arr.slice(4, arr.length - 2);
        }
        const res = [];
        while (stationsSrc.length) {
            res.push(stationsSrc.splice(0, 6));
        }
        return res.filter(item => item[4]).map(item => {
            return {
                mcc: parseInt(item[0], 10),
                mnc: parseInt(item[1], 10),
                lac: parseInt(item[2], 16),
                cellId: parseInt(item[3], 16),
                rxLevel: parseInt(item[4]),
                deviceId: deviceId,
                date
            };
        });
    }
    strToDate(str) {
        return new Date(Number(str.slice(0, 4)), Number(str.slice(4, 6)) - 1, Number(str.slice(6, 8)), Number(str.slice(8, 10)), Number(str.slice(10, 12)), Number(str.slice(12, 14)));
    }
    setType(str) {
        switch (true) {
            case !str: {
                this.messageType = -1;
                break;
            }
            case typeof str !== 'string': {
                this.messageType = -1;
                break;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTSTR,\d+,\d+,.+/): {
                this.messageType = MessageType.GTSTR;
                break;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTLBS,\d+,\d+,.+/): {
                this.messageType = MessageType.GTLBS;
                break;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTGSM,\d+,\d+,.+/): {
                this.messageType = MessageType.GTGSM;
                break;
            }
            default: {
                this.messageType = -1;
                break;
            }
        }
        switch (this.messageType) {
            case MessageType.GTGSM:
            case MessageType.GTLBS: {
                this.type = 'BS';
                break;
            }
            case MessageType.GTSTR: {
                this.type = 'POINT';
                break;
            }
        }
    }
}
exports.Gl520Parser = Gl520Parser;
//# sourceMappingURL=gl-520-parser.js.map