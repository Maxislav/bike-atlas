import { BaseStationLocation } from '../tcp/base-station-location';
import {ProtoData} from './proto-data';

const path = require('path');
const https = require('https');


interface MobileCell {
    mcc: number;
    mnc: number;
    lac: number;
    cellId: number;
}

export class OnGtgbc extends ProtoData {

    constructor(public socket, public util) {
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

