let app, ioServer;
const dateFormat = require('dateformat');
//const util = require('./socket-data/util');
const http = require("http");
const distance = require('./distance');
const Robot = require('./robot');

class Logger {
    /** @namespace this.connection */
// $GPRMC,074624,A,5005.91360,N,3033.15540,E,13.386224,222.130005,290718,,*1E wrong  -> 50.98559952
//
// $GPRMC,074553,A,5006.02390,N,3033.30500,E,16.895118,220.089996,290718,,*1A   -> 50.10039902

    //  /log?id=862614000171302&dev=862614000171302&acct=862614000171302&batt=0&code=0xF020&alt=0.0&gprmc=$GPRMC,111925,A,5023.32022,N,3029.64240,E,0.000000,0.000000,050117,,*29
    //  /log?id=862614000171302&dev=862614000171302&acct=862614000171302&batt=0&code=0xF020&alt=0.0&gprmc=$GPRMC,152524,A,5005.91360,N,3033.15540,E,13.386224,222.130005,010818,,*1E
    constructor(_app, _ioServer, util) {
        app = _app;
        ioServer = _ioServer;
        this.util = util;

        //this.connection = connection;


        this.robot = new Robot(util);
        this._sockets = {};
        this.devices = {};
        app.get('/log*', this.onLog.bind(this))
    }

    onLog(req, res, next) {
        const util = this.util

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
            try {
                data = this.parseGprmc(req.query.gprmc, req.query.id);
                data.device_key = data.id = req.query.id;
            } catch (err) {
                console.error('Error parse', err)
            }

        } else {
            res.setStatus = 500;
            res.end();
        }
        if (data) {
            util.insertLog(data)
                .catch(err => [
                    console.error('insertLog error ->', err)
                ])
        }

        console.log('onLog ->', data);

        const emitedSockets = [];

        if (this.devices && this.devices[device_id]) {
            this.devices[device_id].forEach(socket_id => {
                if (data) {
                    emitedSockets.push(socket_id);
                    this.sockets[socket_id] && this.sockets[socket_id].emit('log', data);
                }
            })
        }
        this.emitUnlockUser(emitedSockets, data)

    }

    emitUnlockUser(emitUnlockUser, device) {
        let _name;
        let _userId;
        let _setting;
        const util = this.util;

        this.util.getOwnerDevice(device.device_key)
            .then(rows => {
                if (rows && rows.length) {
                    _userId = rows[0].id;
                    _name = rows[0].name;
                    return util.getUserSettingByUserId(_userId)
                        .then(setting => {
                            return setting
                        })
                }
                return null;
            })
            .then(setting => {
                console.log('setting ->', setting)
                if (setting && setting.lock == 0) {
                    _setting = setting;
                    return util.getPrivateArea(_userId)
                }
                return false
            })
            .then(areas => {
                console.log('areas->', areas)
                if (areas) {
                    const isInPrivate = distance.isInPrivate(areas, device);

                    if (!isInPrivate) {
                        console.log('emitUnlockUser->', isInPrivate);

                        for (var socket_id in this.sockets) {
                            if (emitUnlockUser.indexOf(socket_id) == -1) {
                                device.ownerId = _userId;
                                device.name = _name;
                                this.sockets[socket_id].emit('log', device)
                            }
                        }
                    }
                }


            })
            .catch(err => {
                console.error('Error emitUnlockUser->', err)
            })

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
        //console.log('logger onDisconnect ->', this.devices)
    }

    // $GPRMC,153946,A,5023.31220,N,3029.63150,E,0.000000,0.000000,03 01 17,,*2A


    //$GPRMC,030853,A,5026.98660,N,3024.51060,E,2.798506,109.540001, 15 09 63   ,,*20
    parseGprmc(gprmc, id) {
        const arrData = gprmc.split(',');
        const timeStamp = arrData[1];
        const dateStamp = arrData[9];
        let lat, lng, azimuth, speed, date;
        let year = String('20').concat(dateStamp[4], dateStamp[5]);
        if(new Date().getFullYear() < year){
            year = new Date().getFullYear()
        }
        if(id === '222222222222'){
            date = new Date(
                year,
                Number('' + dateStamp[2] + dateStamp[3]) - 3, //month
                Number('' + dateStamp[0] + dateStamp[1]) -10, //day
                Number( '' + timeStamp[0] + timeStamp[1]) + 6, //hour
                Number('' + timeStamp[2] + timeStamp[3]) + 30, //min
                Number('' + timeStamp[4] + timeStamp[5]) + 30, //sec
            )
        }else{
            date = new Date(
                year,
                parseFloat('' + dateStamp[2] + dateStamp[3]) - 1,
                '' + dateStamp[0] + dateStamp[1],
                '' + timeStamp[0] + timeStamp[1],
                '' + timeStamp[2] + timeStamp[3],
                '' + timeStamp[4] + timeStamp[5]
            );
            lat = arrData[4] === 'N' ? minToDec(arrData[3]) : '-' + minToDec(arrData[3]);
            lng = arrData[6] === 'E' ? minToDec(arrData[5]) : '-' + minToDec(arrData[5]);
            azimuth = parseFloat(Number(arrData[8]).toFixed(2));
            speed = parseFloat(arrData[7]) * 1.852;
        }



        return {
            date,
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
        this.robot.sockets = connected;
    }

    get sockets() {
        return this._sockets;
    }


};

function minToDec(src) {
    let lng = src.split('');
    let comaIndex = lng.indexOf('.');
    lng.splice(comaIndex, 1);
    lng.splice(comaIndex - 2, 0, ':');
    lng = lng.join('');
    let arrLng = lng.split(':');
    let prefix = arrLng[0];
    let suffix = arrLng[1].split('');
    suffix.splice(2, 0, '.');
    suffix = suffix.join('');
    suffix = parseFloat(suffix) / 60;
    return parseFloat(Number(prefix) + suffix).toFixed(6);
}

module.exports = Logger;