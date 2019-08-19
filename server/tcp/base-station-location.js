"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
class ReqData {
    constructor(mcc, mnc) {
        this.mcc = mcc;
        this.mnc = mnc;
        this.radio = 'gsm';
        this.cells = [];
    }
    setCells(cellList) {
        this.cells.length = 0;
        cellList.forEach(cell => {
            this.cells.push(cell);
        });
        return this;
    }
    toJsonString() {
        return JSON.stringify(Object.assign({ token: ReqData.token }, this));
    }
}
ReqData.token = 'c0a03eae5fa12e';
class BaseStationLocation {
    constructor() {
    }
    getLatLngList(d) {
        const reqData = new ReqData(d.mcc, d.mnc).setCells(d.cells);
        const postData = reqData.toJsonString();
        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'us1.unwiredlabs.com',
                port: 443,
                path: '/v2/process.php',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postData)
                }
            }, (proxyResponse) => {
                let resData = '';
                proxyResponse.on('data', function (chunk) {
                    resData += chunk;
                });
                proxyResponse.on('end', function () {
                    const str = resData.toString();
                    let j;
                    try {
                        j = JSON.parse(str);
                    }
                    catch (e) {
                        console.error('Parse error ->', e);
                        return reject(e);
                    }
                    resolve(j);
                });
            });
            req.write(postData);
            req.end();
        });
    }
    getLatLng(mc) {
        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'opencellid.org',
                port: 443,
                //path: `/gsm/classes/Cell.Search.php?mcc=${mc.mcc}&mnc=${mc.mnc}&lac=${mc.lac}&cid=${mc.cellId}`,
                //cell/get?key=c0a03eae5fa12e&mcc=260&mnc=2&lac=10250&cellid=26511&format=json
                path: `/cell/get?key=c0a03eae5fa12e&mcc=${mc.mcc}&mnc=${mc.mnc}&lac=${mc.lac}&cellid=${mc.cellId}&format=json`,
                method: 'GET'
            }, (proxyResponse) => {
                let resData = '';
                proxyResponse.on('data', function (chunk) {
                    resData += chunk;
                });
                proxyResponse.on('end', function () {
                    const str = resData.toString();
                    let j;
                    try {
                        j = JSON.parse(str);
                    }
                    catch (e) {
                        console.error('Parse error ->', e);
                        return reject(e);
                    }
                    resolve({
                        id: mc.cellId,
                        lng: Number(j.lon),
                        lat: Number(j.lat),
                        range: Number(j.range)
                    });
                });
            })
                .on('error', (e) => {
                console.error(e);
                reject(e);
            });
            req.end();
        });
    }
}
exports.BaseStationLocation = BaseStationLocation;
//# sourceMappingURL=base-station-location.js.map