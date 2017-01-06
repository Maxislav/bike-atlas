const dateFormat = require('dateformat');

module.exports = {
    getUserIdByHash: function (connection, hash) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `hash` WHERE `key`=?', [hash], (err, rows) => {
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
    },
    getUserById: function (connection, id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `user` WHERE `id`=?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows[0]);
            });
        })
            .catch(err => {
                console.error('Error getUserById', err)
            });
    },
    updateSocketIdByHash: function (connection, hash, socket_id) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE `hash` SET socket_id = ? WHERE hash.key = ?', [socket_id, hash], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve()
            })
        })
    },
    deleteHashRow: function (connection, hash) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `hash` WHERE `key`=?', [hash], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result)
            })
        })
    },
    delDeviceByUserDeviceKey: function (connection, user_id, device_key) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `device` WHERE `user_id`=? AND `device_key`=?', [user_id, device_key], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result)
            })
        })
    },
    getDeviceByHash: function (connection, hash) {
        return this.getUserIdByHash(connection, hash)
            .then(user_id => {
                return new Promise((resolve, reject) => {
                    connection.query('SELECT * FROM `device` WHERE `user_id`=?', [user_id], function (err, rows) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(rows)
                    })
                })
            })
    },
    getUserByHash: function (connection, hash) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `user` INNER JOIN `hash` ON hash.user_id = user.id AND hash.key=?', [hash], (err, rows) => {
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

    },
    getUserIdBySocketId: function (connection, socket_id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `hash` WHERE `socket_id`=?', [socket_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (rows && rows.length) {
                    resolve(rows[0].user_id);
                } else {
                    resolve(rows)
                }

            });
        })
    },
    addDeviceBySocketId: function (connection, socket_id, device) {
        return this.getUserIdBySocketId(connection, socket_id)
            .then(user_id => {
                return new Promise((resolve, reject) => {
                    connection.query('INSERT INTO `device` (`id`, `user_id`, `device_key`, `name` ,`phone`) VALUES (NULL, ?, ?, ?, ?)',
                        [user_id, device.id, device.name, device.phone], (err, results) => {
                            if (err) {
                                reject(err)
                            }
                            resolve(true)
                        });
                })
            })
    },

    insertLog: function (connection, data) {
        return new Promise((resolve, reject)=>{
            connection.query('INSERT INTO `logger` (`id`, `device_key`, `lng`, `lat`, `alt`, `speed`, `azimuth`, `date`, `src`) VALUES (' +
                'NULL, ?, ?, ?, ?, ?, ?, ?, ?)',
                [data.id, data.lng, data.lat, data.alt, data.speed, data.azimuth, data.date, data.src], (err, result)=>{

                if(err){
                    reject(err);
                    return;
                }
                resolve(result)

            } )
        })
    },
    getLastPosition: function (connection, device) {
        return new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM `logger` WHERE `device_key`=? ORDER BY `date` DESC LIMIT 1 ', [device.id], (err, rows) => {
                if(err){
                    reject(err)
                    return;
                }
                resolve (rows)

            })
        })

    },
    onRegist: function (connection, d) {
        return this.checkExistUser(connection, d)
            .then((rows) => {
                if (rows.length) {
                    return {
                        result: false,
                        message: 'User exist'
                    }
                } else {
                    return this.addUser(connection, d)
                        .then(result=>{
                            return this.addSettingUser(connection, result.insertId)
                                .then((result)=>{
                                    return {
                                        result: 'ok',
                                        message: null
                                    }
                                })
                        })
                }
            })
            .catch((err) => {
                console.log('onRegist +>', err)
            })
    },
    checkExistUser: function (connection, d) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT `name` from user WHERE `name`=? order by `id` desc limit 150';
            connection.query(query, [d.name, d.pass], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        })
    },
    addUser: function (connection, d) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `user` ' +
                '(`id`, `name`, `pass`, `opt`) VALUES (NULL, ?, ?, NULL)', [d.name, d.pass], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('results', results)
                resolve(results);
            })
        })
    },
    addSettingUser: function (connection, user_id) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `setting` ' +
                '(`id`, `user_id`, `map`, `hill`, `lock`) VALUES (NULL, ?, ?, ?, ?)', [user_id, 'ggl', true, true], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            })
        })
    },
    getUserSettingByUserId: function (connection, user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `setting` WHERE `user_id`=? order by `id` desc limit 150';
            connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows[0])
            })
        })
    },
    setImageProfile: function (connection, user_id, base64) {
        return new Promise((resolve, reject) => {
            connection.query('UPDATE `user` SET image = ? WHERE id = ?', [base64, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve()
            })
        })
    },
    formatDevice: function(d) {
        return {
            id: d.device_key,
            alt: d.alt,
            azimuth: d.azimuth,
            date: d.date.toISOString(),//dateFormat(d.date, 'yyyy-mm-dd HH:MM:ss.L'),
            lat: d.lat,
            lng: d.lng,
            speed: d.speed,
            src: d.src
        }
    }

};
