"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnGtgbc = void 0;
const base_station_location_1 = require("../tcp/base-station-location");
const proto_data_1 = require("./proto-data");
const path = require('path');
const https = require('https');
class OnGtgbc extends proto_data_1.ProtoData {
    constructor(socket, util) {
        super(socket, util);
        this.socket = socket;
        this.util = util;
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