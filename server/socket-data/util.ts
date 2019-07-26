import { LoggerRow , DeviceRow} from '../types';

const dateFormat = require('dateformat');
const hashKeys = [];


class Util {
    private  connection
    constructor(connection) {
        this.connection = connection;
    }

    updateConnect(connection) {
        this.connection = connection;
    }


    getUserIdByHash(connection, hash) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `hash` WHERE `key`=?', [hash], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows && rows.length) {
                    resolve(rows[0].user_id);
                } else {
                    resolve(null)
                }

            });
        })
    }

    getUserById(id) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `user` WHERE `id`=?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0]);
            });
        })

    }

    /**
     *
     * @param {String} name
     * @return {Promise}
     */
    getUserByName(name) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * from user WHERE `name`=? order by `id` desc limit 1', [name], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        })
    }

    updateSocketIdByHash(hash, socket_id) {
        return new Promise((resolve, reject) => {
            this.connection.query('UPDATE `hash` SET socket_id = ? WHERE hash.key = ?', [socket_id, hash], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve()
            })
        })
    }

    deleteHashRow(hash) {
        return new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM `hash` WHERE `key`=?', [hash], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result)
            })
        })
    }

    delDeviceByUserDeviceKey(user_id, device_key) {
        return new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM `device` WHERE `user_id`=? AND `device_key`=?', [user_id, device_key], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result)
            })
        })
    }

    detDeviceByUserId(useIds) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `device` WHERE `user_id` IN(' + useIds + ')', [], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result)
            })
        })
    }

    getDeviceByHash(connection, hash) {
        return this.getUserIdByHash(connection, hash)
            .then(user_id => {
                return new Promise((resolve, reject) => {
                    this.connection.query('SELECT * FROM `device` WHERE `user_id`=?', [user_id], function (err, rows) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(rows)
                    })
                })
            })
    }

    getDeviceByIds(connection, ids) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `device` WHERE `user_id` IN( ' + ids + ' )', [], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        })
    }

    getDeviceByKey(device_key) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT `user_id` FROM `device` WHERE `device_key`= ? ', [device_key], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        })
    }

    getDeviceByUserId(user_id: string): Promise<Array<DeviceRow>> {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `device` WHERE `user_id`=?', [user_id], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        })
    }

    getTrackFromTo(deviceKey, from, to) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `logger` WHERE `device_key`=? AND date>? AND date<? ORDER BY date', [deviceKey, from, to], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        })
    }

    getLastDateTrack(keys) {
        //'SELECT * FROM `device` WHERE `user_id` IN( '+ids+' )1
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT `date` FROM `logger` WHERE `device_key` IN(' + keys + ') ORDER BY date DESC LIMIT 1', [], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0])
            })
        })

    }

    getUserByHash(hash) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `user` INNER JOIN `hash` ON hash.user_id = user.id AND hash.key=?', [hash], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0]);

            });
        })
            .catch(err => {
                console.error('Error getUserByHash', err)
            });

    }

    getDeviceKeyByPointId(pointId) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT `device_key` FROM `logger` WHERE id=? LIMIT 1', [pointId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0]);
            })
        })
    }

    delPointsByIds(ids) {
        // DELETE FROM table WHERE (col1,col2) IN ((1,2),(3,4),(5,6))
        return new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM `logger`  WHERE id IN (' + ids + ')', [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            })
        })
    }


    getUserIdBySocketId(socket_id) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `hash` WHERE `socket_id`=?', [socket_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows && rows.length) {
                    resolve(rows[0].user_id);
                } else {
                    reject(rows)
                }
            });
        })
    }

    getUserNameById(userId) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT name FROM `user` WHERE `id`=?', [userId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows && rows.length) {
                    resolve(rows[0].name);
                } else {
                    reject(rows)
                }
            });
        })
            .catch(err => {
                console.error('getUserNameBySocketId - >', err)
            })
    }

    addDeviceBySocketId(socket_id, device) {

        return this.getUserIdBySocketId(socket_id)
            .then(user_id => {
                return new Promise((resolve, reject) => {
                    this.connection.query('INSERT INTO `device` (`id`, `user_id`, `device_key`, `name` ,`phone`) VALUES (NULL, ?, ?, ?, ?)',
                        [user_id, device.id, device.name, device.phone], (err, results) => {
                            if (err) {
                                reject(err)
                            }
                            resolve(true)
                        });
                })
            })
    }

    /**
     *
     * @param {{lng: number, id: string, lat: number}}data
     * @returns {Promise}
     *
     *  date,
         alt: 0,
         lng,
         lat,
         azimuth: azimuth || 0,
         speed,
         src: gprmc

     *
     */
    insertLog(data) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `logger` (`id`, `device_key`, `lng`, `lat`, `alt`, `speed`, `azimuth`, `date`, `type`, `src`) VALUES (' +
                'NULL, ?, ?, ?, ?, ?, ?, ?, ?,?)',
                [data.id, data.lng, data.lat, data.alt, data.speed, data.azimuth, data.date,  data.type,  data.src], (err, result) => {

                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result)

                })
        })
    }

    getLastPosition(device_key: string): Promise<LoggerRow> {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `logger` WHERE `device_key`=? AND `type`=\'POINT\' ORDER BY `date` DESC LIMIT 1 ', [device_key], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                // rows[0].name = device.name;
                resolve(rows[0])

            })
        })

    }

    getLastBSPosition(device_key: string): Promise<Array<LoggerRow>>{
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `logger` WHERE `device_key`=? AND `type`=\'BS\' ORDER BY `date` DESC LIMIT 50 ', [device_key], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                // rows[0].name = device.name;
                resolve(rows)
            })
        })
    }

    onRegist(d): Promise<any>{
        return this.checkExistUser(d)
            .then((rows: Array<any>) => {
                if (rows.length) {
                    return Promise.resolve({
                        result: false,
                        message: 'User exist'
                    })
                } else {
                    return <any>this.addUser(d)
                        .then(result => {
                            return this.addSettingUser(result.insertId)
                                .then((result) => {
                                    return Promise.resolve( {
                                        result: 'ok',
                                        message: null
                                    })
                                })
                        })
                }
            })
            .catch((err) => {
                console.log('onRegist ++>', err);
                return err;
            })
    }

    checkExistUser(d): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const query = 'SELECT `name` from user WHERE `name`=? order by `id` desc limit 150';
            this.connection.query(query, [d.name, d.pass], (err, rows: Array<any>) => {
                if (err) {

                    return reject(err);
                }
                resolve(rows)
            })
        })
    }

    addUser(d): Promise<{[key: string]: string}> {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `user` ' +
                '(`id`, `name`, `pass`, `opt`) VALUES (NULL, ?, ?, NULL)', [d.name, d.pass], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('results ->', results);
                resolve(results);
            })
        })
    }

    getPrivateArea(user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `private_area` WHERE `user_id`=? order by `id` desc limit 150';
            this.connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        })
    }


    removePrivateArea(connection, area_id) {

        return new Promise((resolve, reject) => {
            const query = 'DELETE from `private_area` WHERE `id` = ?';
            this.connection.query(query, [area_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    }

    addPrivateArea(user_id, area) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `private_area` ' +
                '(`id`, `user_id`, `lng`, `lat`, `radius`) VALUES (NULL, ?, ?, ?, ?)', [user_id, area.lng, area.lat, area.radius], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('results ->', results);
                resolve(results);
            })
        })
    }

    lockPrivateArea(user_id, lock) {
        return new Promise((resolve, reject) => {
            lock = lock ? 1 : 0;
            this.connection.query('UPDATE `setting` SET setting.lock = ? WHERE user_id = ? ', [lock, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve()
            })
        })
    }

    addSettingUser(user_id) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `setting` ' +
                '(`id`, `user_id`, `map`, `hill`, `lock`) VALUES (NULL, ?, ?, ?, ?)', [user_id, 'ggl', true, true], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            })
        })
    }

    getUserSettingByUserId(user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `setting` WHERE `user_id`=? order by `id` desc limit 150';
            this.connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows[0])
            })
        })
    }

    setImageProfile(user_id, base64) {
        return new Promise((resolve, reject) => {
            this.connection.query('UPDATE `user` SET image = ? WHERE id = ?', [base64, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve()
            })
        })
    }

    getUsersNotSelf(user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT user.id, `name`,`image`, `last_visit` from `user` INNER JOIN `setting` ON user.id = setting.user_id AND user.id != ? order by `id` desc limit 150';
            this.connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });

    }

    onInviteFromToId(user_id, invite_user_id) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `invite` ' +
                '(`id`, `user_id`, `invite_user_id`, `active`) ' +
                'VALUES (NULL, ?, ?, ?)', [user_id, invite_user_id, true], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            })
        })
    }

    onCancelInvite(user_id, enemy_id) {
        return new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM `invite` WHERE `user_id`=? AND `invite_user_id`=?', [user_id, enemy_id], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result)
            })
        })
    }

    getInvites(user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT user_id, image, name from `user` INNER JOIN `invite` ON invite.user_id = user.id AND invite.invite_user_id=? ';
            this.connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    }

    getOwnerDevice(device_key) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT user.id, device.name from `user` INNER JOIN `device` ON device.user_id = user.id AND device_key=? ';
            this.connection.query(query, [device_key], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    }

    getMyInvites(user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `invite` WHERE `user_id` = ?  order by `id` desc limit 150';
            this.connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    }

    delFriend(user_id, friend_id) {
        const fr1 = new Promise((resolve, reject) => {
            const query = 'DELETE from `friends` WHERE `user_id` = ? AND `friend_id`= ?';
            this.connection.query(query, [user_id, friend_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
        const fr2 = new Promise((resolve, reject) => {
            const query = 'DELETE from `friends` WHERE `user_id` = ? AND `friend_id`= ?';
            this.connection.query(query, [friend_id, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
        return Promise.all([fr1, fr2])
    }

    getInviteByOwnerId(user_id, friend_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `invite` WHERE `user_id` = ? AND `invite_user_id`=?  order by `id` desc limit 1';
            this.connection.query(query, [friend_id, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    }

    getUserImageById(user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `user` WHERE `id` = ? order by `id` desc limit 1';
            this.connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                if (rows && rows.length) {
                    resolve(rows[0].image)
                } else {
                    reject(`no user-> ${rows}`)
                }

            })
        });
    }

    setFriends(user_id, friend_id) {
        const fr1 = new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `friends` ' +
                '(`id`, `user_id`, `friend_id`) ' +
                'VALUES (NULL, ?, ?)', [user_id, friend_id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            })
        });
        const fr2 = new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `friends` ' +
                '(`id`, `user_id`, `friend_id`) ' +
                'VALUES (NULL, ?, ?)', [friend_id, user_id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            })
        });
        return Promise.all([fr1, fr2])
    }

    delInvite(id) {
        return new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM `invite` WHERE `id`=?', [id], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result)
            })
        })
    }

    delInviteByUserId(id) {
        return new Promise((resolve, reject) => {
            this.connection.query('DELETE FROM `invite` WHERE `user_id`=?', [id], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result)
            })
        })
    }

    getFriends(user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT user.id, image, name, setting.last_visit FROM `user` INNER JOIN `friends` ON friends.friend_id = user.id ' +
                'INNER JOIN `setting` ON friends.friend_id = setting.user_id  AND friends.user_id = ?';
            this.connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    }

    getFriendIds(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT `friend_id` FROM `friends` WHERE user_id=?';
            this.connection.query(query, [userId], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        })

    }

    chatHistory(fromUserId, toUserId) {
        return Promise.all([
            new Promise((resolve, reject) => {
                const query = 'SELECT * from `chat` WHERE from_user_id=? AND to_user_id=?  ORDER BY `date` DESC LIMIT 40';
                this.connection.query(query, [fromUserId, toUserId], (err, rows) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(rows)
                })
            }),
            new Promise((resolve, reject) => {
                const query = 'SELECT * from `chat` WHERE from_user_id=? AND to_user_id=? ORDER BY `date` DESC LIMIT 40';
                this.connection.query(query, [toUserId, fromUserId], (err, rows) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(rows)
                })
            })
        ])

    }

    chatUnViewed(userId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `chat` WHERE to_user_id=? AND viewed=? ORDER BY `date` DESC LIMIT 40';
            this.connection.query(query, [userId, 0], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        })
    }

    chatResolveUnViewed(userId, ids) {
        //this.connection.query('SELECT * FROM `device` WHERE `user_id` IN( '+ids+' )', [], function (err, rows) {

        return new Promise((resolve, reject) => {
            const query = 'UPDATE `chat` SET viewed = ? WHERE chat.id IN(' + ids + ') AND to_user_id=?';
            this.connection.query(query, [1, userId], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        })
    }

    /**
     *
     * @param connection
     * @param {{fromUserId : number, toUserId: number, text: String, date: Date}}data
     * @returns {Promise}
     */
    onChatSend(data) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `chat` ' +
                '(`id`, `from_user_id`, `to_user_id`, `text`, `viewed`, `date`) ' +
                'VALUES (NULL, ?, ?, ?, ?, ?)', [data.fromUserId, data.toUserId, data.text, 0, data.date], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            })
        });
    }

    /**
     *
     * @param {Date}date
     * @param {number}userId
     */
    chatLeave(userId, date) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE `setting` SET last_visit = ? WHERE user_id=?';
            this.connection.query(query, [date, userId], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        })
    }

    getDemoId() {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT id FROM `user` WHERE `name`=?', ['demo'], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(rows[0] ? rows[0].id : -1)
            });
        })
    }

    onStrava(userId, stravaClientId, stravaClientSecret, atlasToken) {
        return new Promise((resolve, reject) => {
            this.connection.query('INSERT INTO `strava` ' +
                '(`id`, `user_id`, `strava_client_id`, `atlas_token`, `strava_client_secret`,`date`) ' +
                'VALUES (NULL, ?, ?, ?, ?, ?)', [userId, stravaClientId, atlasToken, stravaClientSecret, new Date()], (err, results) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY') {
                        this.connection.query('UPDATE `strava` SET  `strava_client_id`=?, `atlas_token`=?, `strava_client_secret`=?, `date`=? WHERE user_id=?',
                            [stravaClientId, atlasToken, stravaClientSecret, new Date(), userId], (err, result) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve(result)
                            });
                    } else {
                        reject(err);
                    }
                }
                resolve(results);
            })
        })

    }

    getStrava(userId) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `strava` WHERE `user_id`=?', [userId], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0])
            });
        })
    }

    stravaUpdateCode(userId, code) {
        return new Promise((resolve, reject) => {
            this.connection.query('UPDATE `strava` SET  `strava_code`=? WHERE user_id=?', [code, userId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        })
    }


    onDeauthorizeStrava(userId) {
        return new Promise((resolve, reject) => {
            this.connection.query('UPDATE `strava` SET  `strava_code`=?, `atlas_token`=?, `strava_client_secret`=? WHERE user_id=?', [null, null, null, userId], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        })
    }

    downloadTrack(deviceKey, point) {
        return this.checkExistPoint(deviceKey, point.lng, point.date)
            .then((res: {[key: string]: string}) => {
                if (res) {
                    return new Promise((resolve, reject) => {
                        this.connection.query('DELETE FROM `logger` WHERE id=?', [res.id], (err, result) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(true)
                        })
                    })
                } else {
                    return Promise.resolve(true)
                }
            })
            .then(d => {
                return new Promise((resolve, reject) => {
                    this.connection.query('INSERT INTO `logger` ' +
                        '(`id`, `device_key`, `lng`, `lat`, `speed`, `date`) VALUES (NULL, ?, ?, ?, ?, ?)',
                        [deviceKey, point.lng, point.lat, point.speed, new Date(point.date)], (err, results) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(results)
                        })
                })
            })
    }

    checkExistPoint(deviceKey, lng, date) {

        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `logger` WHERE `device_key`=? AND date=?', [deviceKey, new Date(date)], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows && rows.length) {
                    resolve(rows[0])
                } else {
                    resolve(false)
                }

            })
        })

    }

    saveMyMarker(userId, markerData) {
        return new Promise((resolve, reject) => {
            const {lng, lat} = markerData.lngLat;
            const {title, id} = markerData;
            if (id) {
                this.connection.query('UPDATE `marker` SET  `lng`=?, `lat`=?, `title`=?, `date`=?  WHERE id=?', [lng, lat, title, new Date(), id], (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(markerData)
                })
            } else {
                this.connection.query('INSERT INTO `marker` ' +
                    '(`id`, `user_id`, `lng`, `lat`, `title`, `date`) VALUES (NULL, ?, ?, ?, ?, ?);',
                    [userId, lng, lat, title, new Date()], (err, results) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(results)
                    })
            }


        })
    }

    getMyMarker(userId): Promise<Array<any>> {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM `marker` WHERE `user_id`=?', [userId], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        })
    }

    removeMyMarker(userId, markerId) {

        return this.getMyMarker(userId)
            .then(markers => {
                return new Promise((resolve, reject) => {
                    if (markers.find(m => m.id === markerId)){
                        this.connection.query('DELETE FROM `marker` WHERE `id`=?', [markerId], function (err, rows) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(rows)
                        })
                    }else {
                        reject('You don\'t have permissions')
                    }
                })

            })


    }

    formatDevice(d) {
        return {
            id: d.device_key,
            alt: d.alt,
            azimuth: d.azimuth,
            date: d.date.toISOString(),//dateFormat(d.date, 'yyyy-mm-dd HH:MM:ss.L'),
            lat: d.lat,
            lng: d.lng,
            speed: d.speed,
            src: d.src,
            name: d.name
        }
    }

    getHash() {
        const $possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let hash = '';
        for (let i = 0; i < 32; i++) {
            hash += '' + $possible[getRandom(0, 61, true)];
        }
        if (-1 < hashKeys.indexOf[hash]) {
            return this.getHash()
        } else {
            return hash;
        }
    }

    clearHash(hash) {
        hashKeys.splice(hashKeys.indexOf(hash), 1)
    }

}

function getRandom(min, max, int) {
    var rand = min + Math.random() * (max - min);
    if (int) {
        rand = Math.round(rand)
    }
    return rand;
}

module.exports = Util;