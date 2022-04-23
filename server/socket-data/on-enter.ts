/**
 * Created by maxislav on 29.12.16.
 */
import {Chat} from '../chat';

const hashKeys = [];
import {autobind} from '../util/autobind';
import {ProtoData} from './proto-data';

function getRandom(min, max, int) {
    var rand = min + Math.random() * (max - min);
    if (int) {
        rand = Math.round(rand);
    }
    return rand;
}


export class OnEnter extends ProtoData {

    public socket;
    public util;
    private logger;
    private chat;

    constructor(socket, util, logger, chat: Chat) {
        super(socket, util);

        this.logger = logger;
        this.chat = chat;
        this.setHashKeys();
        // socket.on('onEnter', this.onEnter.bind(this));
        this.socket.$get('onEnter', this.onEnter);

        socket.on('onExit', this.onExit.bind(this));
    }

    @autobind()
    onEnter(req, res) {
        const {data} = req;
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
                    } else {
                        console.error(rows[0].pass);
                        res.end(
                            {
                                result: false,
                                message: 'user or password incorrect'
                            }
                        )
                    }

                } else {
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
        } else {
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
                } else {
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

