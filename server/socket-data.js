"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketStream = require('socket.io-stream');
const mysql = require('mysql');
const config = require('./mysql.config.json');
require("./colors");
const io = require('socket.io');
config.mysql['database'] = 'monitoring';
//let connection = mysql.createConnection(config.mysql);
const on_enter_1 = require("./socket-data/on-enter");
const on_auth_1 = require("./socket-data/on-auth");
const Device = require('./socket-data/device');
const on_regist_1 = require("./socket-data/on-regist");
const OnProfile = require('./socket-data/on-profile');
const on_friends_1 = require("./socket-data/on-friends");
const OnPrivateArea = require('./socket-data/on-private-area');
const chat_1 = require("./chat");
const TrackFromTo = require('./socket-data/track-from-to');
const OnChat = require('./socket-data/on-chat');
//const Logger = require('./logger');
const gps_logger_1 = require("./gps-logger/gps-logger");
const gl_520_1 = require("./tcp/gl-520");
const on_gtgbc_js_1 = require("./socket-data/on-gtgbc.js");
const util_1 = require("./socket-data/util");
const OnStrava = require('./socket-data/on-strava');
const OnImportKml = require('./socket-data/on-impork-kml');
const on_my_marker_js_1 = require("./socket-data/on-my-marker.js");
let connection, server, app;
let resolveExport;
let promiseExport = new Promise((resolve, reject) => {
    resolveExport = resolve;
});
let socketData;
// declare const Callback: (req: {hash: string, data: any}, res: {end: (data: any)=> void}) => void
class SSocket {
    constructor(s) {
        Object.setPrototypeOf(this.constructor.prototype, s);
        SSocket.listenerHashMap = {};
        this.on = s.on.bind(s);
        this.emit = s.emit.bind(s);
    }
    $get(name, callback) {
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
SSocket.listenerHashMap = {};
exports.SSocket = SSocket;
class SocketData {
    constructor(server, app, connection) {
        this.connection = connection;
        const util = new util_1.Util(connection);
        const ioServer = io(server);
        const logger = new gps_logger_1.Logger(app, ioServer, util);
        this.gl520 = new gl_520_1.Gl520(ioServer, util).create();
        const chat = new chat_1.Chat(util);
        ioServer.on('connection', (s) => {
            const socket = new SSocket(s);
            socket.$get('gettt', (req, res) => {
                const reqData = req.data;
                res.end(reqData);
            });
            logger.sockets = ioServer.sockets.connected;
            chat.sockets = ioServer.sockets.connected;
            this.gl520.setSocketsConnected(ioServer.sockets.connected);
            const onEnter = new on_enter_1.OnEnter(socket, util, logger, chat);
            const onAuth = new on_auth_1.OnAuth(socket, util, chat, logger, this.gl520);
            const device = new Device(socket, util, logger);
            const onRegist = new on_regist_1.OnRegist(socket, util, logger);
            const onProfile = new OnProfile(socket, util, logger);
            const onFriend = new on_friends_1.OnFriend(socket, util, logger, chat);
            const onPrivateArea = new OnPrivateArea(socket, util);
            const trackFromTo = new TrackFromTo(socket, util);
            const onChat = new OnChat(socket, util, chat);
            const onStrava = new OnStrava(socket, util);
            const onImportKml = new OnImportKml(socket, util);
            const onMyMarker = new on_my_marker_js_1.OnMyMarker(socket, util);
            const onGtgbc = new on_gtgbc_js_1.OnGtgbc(socket, util);
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
        if (err)
            throw err;
        //console.log('MySql connected as id ->'.yellow  +  ` ${connection.threadId}`);
        console.log('MySql connected as id '.yellow + '->' + ` ${connection.threadId}`.green);
        promiseExport
            .then(d => {
            server = d.server;
            app = d.app;
            if (socketData) {
                socketData.updateConnect(connection);
            }
            else {
                socketData = new SocketData(server, app, connection);
            }
        });
    });
};
connectionConnect();
module.exports = (server, app) => {
    //server = _server; app = _app;
    resolveExport({ server, app });
    // socketData =   new SocketData(server, app, connection)
    //INSERT INTO `user` (`id`, `name`, `pass`, `opt`) VALUES (NULL, 'max', 'eeew', NULL);
};
//# sourceMappingURL=socket-data.js.map