import * as https from 'https';
import { BaseStationPoint, MobileCell } from './types';


export class BaseStationLocation {
    constructor() {

    }

    getLatLng(mc: MobileCell): Promise<BaseStationPoint> {
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
                    let j:{lat: number, lon: number, cellid: number};
                    try{
                        j = JSON.parse(str);
                    }catch(e){
                        console.error('Parse error ->',e);
                        return reject(e);

                    }


                    resolve({
                        id: mc.cellId,
                        lng: Number(j.lon),
                        lat: Number(j.lat)
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

