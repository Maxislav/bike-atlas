"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_station_location_1 = require("../tcp/base-station-location");
const path = require('path');
const https = require('https');
const ProtoData = require('./proto-data');
class OnGtgbc extends ProtoData {
    constructor(socket, util, logger) {
        super(socket, util);
        this.socket = socket;
        this.util = util;
        this.logger = logger;
        const onGtgbc = this.onGtgbc.bind(this);
        this.socket.$get('onGtgbc', onGtgbc);
    }
    onGtgbc(req, res) {
        const data = req.data;
        new base_station_location_1.BaseStationLocation();
        Promise.all(data.map(cell => {
            return new base_station_location_1.BaseStationLocation()
                .getLatLng(cell);
        }))
            .then((lngLatList) => {
            res.end({
                cells: lngLatList
            });
        })
            .catch(err => {
            res.end({
                error: err.toString()
            });
        });
    }
}
exports.OnGtgbc = OnGtgbc;
//# sourceMappingURL=on-gtgbc.js.map