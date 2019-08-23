import { BaseStationLocation } from '../tcp/base-station-location';

const path = require('path');
const https = require('https');
const ProtoData = require('./proto-data');


interface MobileCell {
    mcc: number;
    mnc: number;
    lac: number;
    cellId: number;
}

export class OnGtgbc extends ProtoData {

    constructor(private socket, private util) {
        super(socket, util);
        const onGtgbc = this.onGtgbc.bind(this);
        this.socket.$get('onGtgbc', onGtgbc);
    }

    onGtgbc(req, res) {

        const data: Array<MobileCell> = req.data;

        new BaseStationLocation()
        Promise.all(data.map(cell => {
            return  new BaseStationLocation()
                .getLatLng(cell)
        }))
            .then((lngLatList) => {

                res.end({
                    cells: lngLatList
                })
            })
            .catch(err=> {
                res.end({
                    error: err.toString()
                })
            })

    }
}

