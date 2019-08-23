import * as https from 'https';
import { BaseStationPoint, MobileCell, CountryNetworkCode, MCell } from './types';


class ReqData {
    static readonly token: string = 'c0a03eae5fa12e';
    radio: string = 'gsm';
    // address: number =  1;
    cells: Array<{lac: number, cid: number}> = [];

    constructor(private mcc: number, private mnc: number) {

    }

    setCells(cellList: Array<{lac: number, cid: number}>): ReqData {
        this.cells.length = 0;
        cellList.forEach(cell => {
            this.cells.push(cell);
        });
        return this
    }


    toJsonString(): string{
        return JSON.stringify(Object.assign({token: ReqData.token}, this));
    }

}


export class BaseStationLocation {
    constructor() {

    }

    getAverageLatLng(d: { mcc: number, mnc: number, cells: Array<{lac: number, cid: number}> }): Promise<{ lat: number, lng: number, accuracy: number, address: string }>  {
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
                    let j: { lat: number, lon: number, accuracy: number, address: string };
                    try {
                        j = JSON.parse(str);
                    } catch (e) {
                        console.error('Parse error ->', e);
                        return reject(e);

                    }


                    resolve({
                        lng: j.lon,
                        lat: j.lat,
                        accuracy: j.accuracy,
                        address: j.address
                    });
                });
            });
            req.write(postData);
            req.end();
        });
    }

    getLatLng(mc: MobileCell): Promise<BaseStationPoint> {
        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'opencellid.org',
                port: 443,
                path: `/cell/get?key=c0a03eae5fa12e&mcc=${mc.mcc}&mnc=${mc.mnc}&lac=${mc.lac}&cellid=${mc.cellId}&format=json`,
                method: 'GET'
            }, (proxyResponse) => {
                let resData = '';
                proxyResponse.on('data', function (chunk) {
                    resData += chunk;
                });
                proxyResponse.on('end', function () {
                    const str = resData.toString();
                    let j: { lat: number, lon: number, cellid: number, range: number, error: string };
                    try {
                        j = JSON.parse(str);
                    } catch (e) {
                        console.error('Parse error ->', e);
                        return reject(e);

                    }
                    if(j.error){
                        resolve({
                            id: mc.cellId,
                            lng: null,
                            lat: null,
                            range: null
                        })
                    }else {
                        resolve({
                            id: mc.cellId,
                            lng: Number(j.lon),
                            lat: Number(j.lat),
                            range: Number(j.range)
                        });
                    }

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

