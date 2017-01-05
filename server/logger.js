let app, ioServer;
const dateFormat = require('dateformat');
const util = require('./socket-data/util');
const http = require( "http" );
module.exports = class Logger {
    /** @namespace this.connection */

    constructor(_app, _ioServer, connection) {
        app = _app;
        ioServer = _ioServer;
        this.connection = connection;
        this._sockets = {};
        this.devices = {};
        app.get('/log*', this.onLog.bind(this))
    }

    onLog(req, res, next) {

        const device_id = req.query.id;
        let data = null;

        let checkSum;
        try {
            checkSum = req.query.gprmc.match(/\*.+$/)[0]
        } catch (err) {
            console.error(err)
        }

        if (checkSum) {
            res.setStatus = 200;
            checkSum = checkSum.replace(/\*/, '');
            res.end(checkSum);
            try{
                data = this.parseGprmc(req.query.gprmc);
                data.id = req.query.id;
            }catch (err){
                console.error('Error parse', err)
            }

        } else {
            res.setStatus = 500;
            res.end();
        }
        if(data){
            util.insertLog(this.connection, data)
        }

        console.log('onLog ->', data);
        if (this.devices && this.devices[device_id]) {
            this.devices[device_id].forEach(socket_id => {
                if(data){
                    this.sockets[socket_id] && this.sockets[socket_id].emit('log', data);
                }
            })
        }
    }

    updateDevice(device_key, socket_id) {
        this.devices[device_key] = this.devices[device_key] || [];
        this.devices[device_key].push(socket_id);
    }

    onDisconnect(id) {
        for (let opt in this.devices) {
            let ids = this.devices[opt];
            let i = 0;
            while (i < ids.length) {
                if (ids[i] == id) {
                    ids.splice(i, 1);
                } else {
                    i++
                }
            }
        }
        console.log('onDisconnect', this.devices)
    }

    // $GPRMC,153946,A,5023.31220,N,3029.63150,E,0.000000,0.000000,030117,,*2A
    parseGprmc(gprmc) {
        const arrData = gprmc.split(',');
        const timeStamp = arrData[1];
        const dateStamp = arrData[9];
        let date = new Date(
            '20' + dateStamp[4] + dateStamp[5],
            parseFloat('' + dateStamp[2] + dateStamp[3]) - 1,
            '' + dateStamp[0] + dateStamp[1],
            '' + timeStamp[0] + timeStamp[1],
            '' + timeStamp[2] + timeStamp[3],
            '' + timeStamp[4] + timeStamp[5]
        );
        const dateMysql = date; //dateFormat(date, 'yyyy-mm-dd HH:MM:ss.L');
        const lat = arrData[4]=='N' ? minToDec(arrData[3]): '-'+minToDec(arrData[3]);
        const lng = arrData[6] == 'E' ? minToDec(arrData[5]): '-'+minToDec(arrData[5]);
        const azimuth = arrData[8];
        const speed = parseFloat(arrData[7])*1.852;

        return {
            date: dateMysql,
            alt: 0,
            lng,
            lat,
            azimuth: azimuth || 0,
            speed,
            src: gprmc
        }
    }

    set sockets(connected) {
        this._sockets = connected;
    }

    get sockets() {
        return this._sockets;
    }


};

function minToDec(src) {
    let lng = src.split('');
    let comaIndex = lng.indexOf('.');
    lng.splice(comaIndex,1);
    lng.splice(comaIndex-2,0,':');
    lng = lng.join('');
    let arrLng = lng.split(':');
    let prefix = arrLng[0];
    let suffix = arrLng[1].split(''); suffix.splice(2,0,'.'); suffix = suffix.join('');
    suffix  = ''+100*parseFloat(suffix)/60;
    suffix = suffix.replace('.', '');
    return parseFloat(prefix+'.'+suffix).toFixed(6);
}
