import * as https from 'https';
import { BaseStationPoint, MobileCell } from './types';


export class BaseStationLocation {
    constructor() {

    }

    getLatLng(mc: MobileCell): Promise<BaseStationPoint> {
        return new Promise((resolve, reject) => {
            const req = https.request({
                hostname: 'cellphonetrackers.org',
                port: 443,
                path: `/gsm/classes/Cell.Search.php?mcc=${mc.mcc}&mnc=${mc.mnc}&lac=${mc.lac}&cid=${mc.cellId}`,
                method: 'GET'
            }, (proxyResponse) => {
                let resData = '';
                proxyResponse.on('data', function (chunk) {
                    resData += chunk;
                });
                proxyResponse.on('end', function () {
                    const str = resData.toString();
                    const lat = str.match(/Lat=-?[\d\.]+/)[0].replace(/^Lat=/, '');
                    const lng = str.match(/Lon=-?[\d\.]+/)[0].replace(/^Lon=/, '');
                    resolve({
                        id: mc.cellId,
                        lng: Number(lng),
                        lat: Number(lat)
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

