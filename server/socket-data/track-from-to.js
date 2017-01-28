const util = require('./util');
const R = require('ramda');

class TrackFromTo {
    constructor(socket, connection) {
        this.socket = socket;
        this.connection = connection;
        socket.on('trackFromTo', this.trackFromTo.bind(this, 'trackFromTo'));
        socket.on('getLastDate', this.getLastDate.bind(this, 'getLastDate'));
        socket.on('delPoints', this.delPoints.bind(this, 'delPoints'));
    }

    getLastDate(eName) {
        let _userId;
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(userId => {
                _userId = userId;
                return util.getDeviceByUserId(this.connection, userId)
            })
            .then(devices=>{
                const keys = []
                devices.forEach(device=>{
                        keys.push(device.device_key)
                });
                return util.getLastDateTrack(this.connection, keys.join(","))
            })
            .then(rows=>{
                this.socket.emit(eName, rows)
            })
            .catch(err => {
                console.error('Error getLastDate ->', err)
            })


    }


    trackFromTo(eName, data) {
        let _userId;
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(userId => {
                _userId = userId;
                return util.getDeviceByUserId(this.connection, userId)
            }).then(devices => {
            return devices
        }).then(devices => {
            const promises = [];
            const tracks = {};
            devices.forEach(device => {
                promises.push(util.getTrackFromTo(this.connection, device.device_key, data.from, data.to)
                    .then(rows => {
                        tracks[device.device_key] = rows;
                        return tracks
                    })
                )
            });

            return Promise.all(promises)
                .then(d => {
                    return tracks
                });
        }).then(tracks => {
            this.socket.emit(eName, {
                result: 'ok',
                devices: tracks
            })
        })
            .catch(err => {
                console.error('Error trackFromTo ->', err)
            })


    }

    delPoints(eName, points){
        let _userId;
        util.getUserIdBySocketId(this.connection, this.socket.id)
            .then(userId => {
                _userId = userId;
                return util.getDeviceByUserId(this.connection, userId)
            }).then(devices => {
            return devices
        }).then(devices =>{
            const deviceKeys =  R.pluck('device_key')(devices);
            const arrPromise = [];

            points.forEach(pointId=>{
                arrPromise.push(util.getDeviceKeyByPointId(this.connection, pointId)
                    .then(device=>{
                        return deviceKeys.indexOf(device.device_key)
                    })
                )
            });
            return Promise.all(arrPromise);
        })
            .then(arr=>{
                if(arr.find((a)=>a==-1)){
                    return Promise.reject( 'no found link device' )
                }else{
                    return util.delPointsByIds(this.connection,points.join(',') )
                }
            })
            .then(rows=>{
                this.socket.emit(eName, {
                    result: 'ok'
                })
            })
            .catch(err => {
                console.error('Error delPoints ->', err)
                this.socket.emit(eName, {
                    result: false,
                    message: err
                })
            })
    }


}

module.exports = TrackFromTo;