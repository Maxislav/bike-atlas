"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gl520 = void 0;
const gl_520_parser_1 = require("./gl-520-parser");
const net = require("net");
const fs = require("fs");
const path = require("path");
const streams = [];
const dateformat = require("dateformat/lib/dateformat.js");
const PORT = 8090;
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
class ClassPointWithSrc {
    constructor(data) {
        this.batt = 0;
        this.src = '';
        Object.keys(data).forEach(key => {
            this[key] = data[key];
        });
    }
}
class Gl520 {
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
    onDisconnect(socket_id) {
        for (let opt in this.devices) {
            let ids = this.devices[opt];
            let i = 0;
            while (i < ids.length) {
                if (ids[i] == socket_id) {
                    ids.splice(i, 1);
                }
                else {
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
                const gl520Parser = new gl_520_parser_1.Gl520Parser();
                try {
                    str = onStreamData.toString();
                }
                catch (e) {
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
                                const pointWithSrc = new ClassPointWithSrc(respData); //  Object.assign({}, {src: ''}, {respData}) // {...respData, src: ''}
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
exports.Gl520 = Gl520;
//# sourceMappingURL=gl-520.js.map