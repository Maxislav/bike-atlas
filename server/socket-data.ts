import { Deferred } from './deferred';

const socketStream = require('socket.io-stream');
const mysql = require('mysql');
const config = require('./mysql.config.json');
import './colors';

const io = require('socket.io');
config.mysql['database'] = 'monitoring';
//let connection = mysql.createConnection(config.mysql);

import { OnEnter } from './socket-data/on-enter';

const {OnAuth} = require('./socket-data/on-auth');
const Device = require('./socket-data/device');
const OnRegist = require('./socket-data/on-regist');
const OnProfile = require('./socket-data/on-profile');
const OnFriend = require('./socket-data/on-friends');
const OnPrivateArea = require('./socket-data/on-private-area');
import { Chat } from './chat';

const TrackFromTo = require('./socket-data/track-from-to');
const OnChat = require('./socket-data/on-chat');
//const Logger = require('./logger');

import { Logger } from './gps-logger/gps-logger';
import { Gl520 } from './tcp/gl-520';
import { OnGtgbc } from './socket-data/on-gtgbc.js';

import { Util } from './socket-data/util';

const OnStrava = require('./socket-data/on-strava');
const OnImportKml = require('./socket-data/on-impork-kml');
import { OnMyMarker } from './socket-data/on-my-marker.js';

let connection, server, app;
let resolveExport;
let promiseExport: Promise<{ server: any, app: any }> = new Promise((resolve, reject) => {
    resolveExport = resolve;
});
let socketData;


declare global {
    interface String {
        yellow: string;
        green: string;
    }
}

// declare const Callback: (req: {hash: string, data: any}, res: {end: (data: any)=> void}) => void

export class SSocket {
    public on: (name: string, callback: Function) => void;
    public emit: Function;
    public id: number;
    private static listenerHashMap: { [name: string]: any } = {};

    constructor(s) {
        Object.setPrototypeOf(this.constructor.prototype, s);
        SSocket.listenerHashMap = {};
        this.on = s.on.bind(s);
        this.emit = s.emit.bind(s);
    }

    $get(name: string, callback: (req: { hash: string, data: any }, res: { end: (data: any) => void }) => void) {
        if (SSocket.listenerHashMap[name]) {
            throw new Error('Name space is used before');
        }
        const receive = (d) => {
            callback({
                hash: d.hash,
                data: d.data
            }, {
                end: (data) => {
                    this.emit(name, {
                        hash: d.hash,
                        data
                    });
                }
            });
        };
        SSocket.listenerHashMap[name] = this.on(name, receive);
    }
}

class SocketData {
    connection: any;
    gl520: Gl520;
    updateConnect: Function;

    constructor(server, app, connection) {
        this.connection = connection;
        const util = new Util(connection);
        const ioServer = io(server);
        const logger = new Logger(app, ioServer, util);
        this.gl520 = new Gl520(ioServer, util).create();
        const chat = new Chat(util);

        ioServer.on('connection', (s) => {

            const socket = new SSocket(s);

            socket.$get('gettt', (req, res) => {
                const reqData = req.data;
                res.end(reqData);
            });


            logger.sockets = ioServer.sockets.connected;
            chat.sockets = ioServer.sockets.connected;
            this.gl520.setSocketsConnected(ioServer.sockets.connected);
            const onEnter = new OnEnter(socket, util, logger, chat);
            const onAuth = new OnAuth(socket, util, chat, logger, this.gl520);
            const device = new Device(socket, util, logger);
            const onRegist = new OnRegist(socket, util, logger);
            const onProfile = new OnProfile(socket, util, logger);
            const onFriend = new OnFriend(socket, util, logger, chat);
            const onPrivateArea = new OnPrivateArea(socket, util);
            const trackFromTo = new TrackFromTo(socket, util);
            const onChat = new OnChat(socket, util, chat);
            const onStrava = new OnStrava(socket, util);
            const onImportKml = new OnImportKml(socket, util);
            const onMyMarker = new OnMyMarker(socket, util);
            const onGtgbc = new OnGtgbc(socket, util);

            socket.on('disconnect', () => {

                this.gl520.onDisconnect(socket.id);

                logger.onDisconnect(socket.id);
                chat.onDisconnect(socket.id);
            });

            socketStream(socket).on('file', function (stream) {
                let data = [];
                stream.on('data', (d) => {
                    data.push(d);
                });
                stream.on('end', (e, d) => {
                    console.log('file send');
                    socket.emit('file', Buffer.concat(data));
                });
            });


        });

        this.updateConnect = (connection) => {
            this.gl520.close()
                .then(() => {
                    this.gl520.create();
                });
            this.connection = connection;
            util.updateConnect(connection);
        };

    }

}


const connectionConnect = () => {
    connection = mysql.createConnection(config.mysql);
    connection.on('error', (err) => {
        console.log(err);
        if (err.code == 'PROTOCOL_CONNECTION_LOST') {
            console.error('PROTOCOL_CONNECTION_LOST ->' + err);
            connection.end();
            setTimeout(connectionConnect, 10000);
        }
    });

    connection.on('connect', (err) => {
        if (err) {
            console.log('err.connect -> ', err);
            return;
        }

        console.log('connected connect ->');

    });
    connection.connect((err) => {
        if (err) throw err;
        //console.log('MySql connected as id ->'.yellow  +  ` ${connection.threadId}`);
        console.log('MySql connected as id '.yellow + '->' + ` ${connection.threadId}`.green);
        promiseExport
            .then(d => {
                server = d.server;
                app = d.app;
                if (socketData) {
                    socketData.updateConnect(connection);
                } else {
                    socketData = new SocketData(server, app, connection);
                }

            });
    });

};
connectionConnect();


module.exports = (server, app) => {
    //server = _server; app = _app;
    resolveExport({server, app});

    // socketData =   new SocketData(server, app, connection)


    //INSERT INTO `user` (`id`, `name`, `pass`, `opt`) VALUES (NULL, 'max', 'eeew', NULL);
};
