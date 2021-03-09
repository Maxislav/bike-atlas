import { Util } from '../socket-data/util';
import { Server } from 'net';
import { SSocket } from '../socket-data';

import {Gl520Parser} from './gl-520-parser';
import * as net from 'net';
import * as  fs from 'fs';

import * as path from 'path';
import {PointWithSrc} from '../types';
import {Point} from './types';
const streams = [];

import * as dateformat from 'dateformat/lib/dateformat.js';
const PORT = 8090;
declare const __dirname: any;


declare global {
    interface String {
        yellow: string;
        green: string;
        red: string
    }
}

const writeToFile = (str) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(path.resolve(__dirname, 'log-file.txt'), str, function (err) {
            if (err) {
                console.log('Err write to file ->'.red, err);
                return reject(err);
            }
            resolve();
        });
    });
};

class ClassPointWithSrc implements PointWithSrc{
    alt: number;
    azimuth: number;
    batt = 0;
    date: Date;
    device_key: string | number;
    id: string | number;
    lat: number;
    lng: number;
    speed: number;
    src = '';
    type: "POINT" | "BS";
    constructor(data: Point) {
        Object.keys(data).forEach(key => {
            this[key] = data[key]
        })
    }

}


export class Gl520 {
    _ioServer: any;
    _util: Util;
    _server: Server;
    socketsConnected: { [socket_id: number]: SSocket };
    devices: { [device_key: string]: Array<number> };

    constructor(_ioServer, util) {
        this._ioServer = _ioServer;
        this._util = util;
        this._server = null;
        this.socketsConnected = [];
        this.devices = {};
    }

    setSocketsConnected(s) {
        this.socketsConnected = s;
        return this;
    }

    onDisconnect(socket_id: number) {
        for (let opt in this.devices) {
            let ids = this.devices[opt];
            let i = 0;
            while (i < ids.length) {
                if (ids[i] == socket_id) {
                    ids.splice(i, 1);
                } else {
                    i++;
                }
            }
        }
    }


    updateDevice(device_key, socket_id) {
        this.devices[device_key] = this.devices[device_key] || [];
        this.devices[device_key].push(socket_id);
    }

    create() {

        this._server = net.createServer((c) => {
            console.log('connect', new Date().toISOString());
            streams.push(c);
            dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss');
            writeToFile(dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss').concat('\r\n', 'connect', '\r\n'));
            c.on('end', () => {
                console.log('client disconnected');
                writeToFile(dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss').concat('\r\n', 'disconnected', '\r\n'));
                const index = streams.indexOf(c);
                if (-1 < index) {
                    streams.splice(index, 1);
                }
            });
            c.on('data', (onStreamData) => {
                let str = '';
                const gl520Parser = new Gl520Parser();
                try {
                    str = onStreamData.toString();
                } catch (e) {
                    console.error(e);
                    console.log('can\'t convert to string');
                }
                if (str) {
                    writeToFile(dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss').concat('\r\n', str, '\r\n'));
                    gl520Parser.setSrcData(str)
                        .getData()
                        .then((resp) => {

                            if (resp.result === 'ok') {
                                resp.points.forEach((respData) => {
                                     const pointWithSrc: PointWithSrc = new ClassPointWithSrc(respData); //  Object.assign({}, {src: ''}, {respData}) // {...respData, src: ''}
                                    this._util.insertLog(pointWithSrc)
                                        .catch(err => {
                                            console.error('Err GL520 insertLog error ->', err);
                                        });

                                    const device_id = respData.id;
                                    if (this.devices && this.devices[device_id]) {
                                        this.devices[device_id].forEach(socket_id => {
                                            if (respData) {
                                                //emitedSockets.push(socket_id);
                                                this.socketsConnected[socket_id] && this.socketsConnected[socket_id].emit('log', respData);
                                            }
                                        });
                                    }
                                });
                            }


                            /*if (respDataList) {
                                respDataList.forEach(respData=> {
                                    this._util.insertLog(respData)
                                        .catch(err => {
                                            console.error('Err GL520 insertLog error ->', err)
                                        });

                                    const device_id = respData.id;
                                    if (this.devices && this.devices[device_id]) {
                                        this.devices[device_id].forEach(socket_id => {
                                            if (respData) {
                                                //emitedSockets.push(socket_id);
                                                this.socketsConnected[socket_id] && this.socketsConnected[socket_id].emit('log', respData);
                                            }
                                        })
                                    }
                                })
                            } else {
                                console.warn('no condition gl520 -> ');
                            }*/
                        })
                        .catch(err => {
                            console.error('err parse gl520 -> ', err);
                        });

                }
                console.log(str);
            });
            c.on('error', (err) => {
                console.error(err);
            });
        });

        this._server.listen(PORT, () => {
            console.log('GL520 server is started'.yellow, `on port:`, `${PORT}`.green);
        });
        return this;
    }

    close() {
        return new Promise((resolve) => {
            if (this._server) {
                this._server.close(() => {
                    this._server = null;
                    resolve();
                });
            }
        });

    }
}

