import { Util } from './socket-data/util';

const fs = require('fs');
const parseString = require('xml2js').parseString;


export class Robot {
    util: Util;
    ownerId: number;
    _sockets: any;

    constructor(util) {
        this.util = util;
        //this.connection = util.connection;
        this.ownerId = null;

        this.util.getDemoId()
            .then(owner_id => {
                this.ownerId = owner_id;
                return this.getPoints();
            })
            .then(points => {
                return this.tick(points);
            })
            .catch(err => {
                console.error('Чтото пошло не так -> ', err);
            });


        this._sockets = [];


    }

    tick(points) {
        const tick = (i) => {
            let timeout = 30000;
            try {
                timeout = points[i].timeout;
                if (30000 < timeout) {
                    timeout = 30000;
                }
            } catch (err) {
                console.log('Err points ->', i, points[i]);
                timeout = 3000;
                i = 0;
            }

            setTimeout(() => {
                const point = points[i];
                for (let id in this.sockets) {
                    this.sockets[id].emit('log', {
                        lng: Number(point.lng),
                        lat: Number(point.lat),
                        device_key: '0000',
                        name: 'Demo robot',
                        ownerId: this.ownerId,
                        bearing: 0,
                        date: new Date().toISOString(),
                        type: 'POINT'
                    });
                }
                if (i < points.length - 2) {
                    tick(++i);
                } else {
                    tick(0);
                }
            }, timeout);
        };
        tick(0);
        return true;
    }


    getPoints() {
        return new Promise((resolve, reject) => {
            const positions = [];
            fs.readFile(__dirname + '/history-2016-12-06.gpx', (err, data) => {
                parseString(data, {trim: true}, (err, result) => {
                    const track = result.gpx.trk[0].trkseg[0].trkpt;
                    track.forEach((item, i) => {
                        const position = {
                            lng: item.$.lon,
                            lat: item.$.lat,
                            timeout: null
                            // timeout: i != (track.length - 2) ? new Date(track[i + 1].time).getTime() - new Date(item.time).getTime() : 10000
                        };

                        if (i < track.length - 2) {
                            position.timeout = new Date(track[i + 1].time).getTime() - new Date(item.time).getTime();
                        } else {
                            position.timeout = 10000;
                        }
                        positions.push(position);
                    });
                    resolve(positions);
                });
            });
        });
    }

    set sockets(sockets) {
        this._sockets = sockets;
    }

    get sockets() {
        return this._sockets;
    }

}


