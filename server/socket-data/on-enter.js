"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const hashKeys = [];
const ProtoData = require("./proto-data");
const autobind_1 = require("../util/autobind");
function getRandom(min, max, int) {
    var rand = min + Math.random() * (max - min);
    if (int) {
        rand = Math.round(rand);
    }
    return rand;
}
class OnEnter extends ProtoData {
    constructor(socket, util, logger, chat) {
        super(socket, util);
        this.logger = logger;
        this.chat = chat;
        this.setHashKeys();
        // socket.on('onEnter', this.onEnter.bind(this));
        this.socket.$get('onEnter', this.onEnter);
        socket.on('onExit', this.onExit.bind(this));
    }
    onEnter(req, res) {
        const { data } = req;
        this.util.getUserByName(data.name)
            .then(rows => {
            if (rows.length) {
                if (rows.length == 1 && rows[0].pass == data.pass) {
                    this.setHash(rows[0].id)
                        .then(hash => {
                        const user = rows[0] || {};
                        res.end({
                            result: 'ok',
                            hash: hash,
                            user: {
                                id: user.id,
                                name: user.name,
                                image: user.image
                            }
                        });
                        this.chat.onEnter(this.socket.id, user.id);
                    })
                        .catch(err => {
                        console.error(err);
                    });
                }
                else {
                    console.error(rows[0].pass);
                    res.end({
                        result: false,
                        message: 'user or password incorrect'
                    });
                }
            }
            else {
                this.socket.emit('onEnter', {
                    result: false,
                    message: 'User not exist'
                });
            }
        })
            .catch(err => {
            console.log('Errr onEnter ->', err);
        });
    }
    getHash() {
        const $possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let hash = '';
        for (let i = 0; i < 32; i++) {
            hash += '' + $possible[getRandom(0, 61, true)];
        }
        if (-1 < hashKeys.indexOf[hash]) {
            return this.getHash();
        }
        else {
            return hash;
        }
    }
    setHash(user_id) {
        const connection = this.util.connection;
        const hash = this.getHash();
        console.log('setHash->', this.socket.id);
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `hash` (`id`, `user_id`, `socket_id`, `key`) VALUES (NULL, ?, ?, ?)', [user_id, this.socket.id, hash], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                else {
                    resolve(hash);
                }
            });
        });
    }
    onExit(data) {
        this.util.deleteHashRow(data.hash)
            .then((d) => {
            this.socket.emit('onExit', {
                result: 'ok'
            });
            const index = hashKeys.indexOf(data.hash);
            if (-1 < index) {
                hashKeys.splice(index, 1);
            }
            this.logger.onDisconnect(this.socket.id);
        })
            .catch(err => {
            this.socket.emit('onExit', {
                result: false,
                message: err
            });
            this.logger.onDisconnect(this.socket.id);
        });
        this.chat.onExit(this.socket.id);
    }
    setHashKeys() {
        const query = 'SELECT * FROM `hash`';
        this.util.connection.query(query, (err, rows) => {
            if (err) {
                console.error('SELECT * FROM `hash', err);
                return;
            }
            //console.log(rows);
            rows.forEach(item => {
                hashKeys.push(item.key);
            });
        });
    }
}
__decorate([
    autobind_1.autobind(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OnEnter.prototype, "onEnter", null);
exports.OnEnter = OnEnter;
//# sourceMappingURL=on-enter.js.map