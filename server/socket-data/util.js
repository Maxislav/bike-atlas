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
    formatDevice: function(d) {
        return {
            id: d.device_key,
            alt: d.alt,
            azimuth: d.azimuth,
            date: d.date,
            lat: d.lat,
            lng: d.lng,
            speed: d.speed,
            src: d.src
        }
    }

};
