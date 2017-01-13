const dateFormat = require('dateformat');

const hashKeys = [];
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

    getDeviceByIds: function (connection, ids) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `device` WHERE `user_id` IN( '+ids+' )', [], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        })
    },
    getDeviceByKey: function (connection, device_key) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT `user_id` FROM `device` WHERE `device_key`= ? ', [device_key], function (err, rows) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows)
            })
        })
    },
    getDeviceByUserId: function (connection, user_id) {
            return new Promise((resolve, reject) => {
                connection.query('SELECT * FROM `device` WHERE `user_id`=?', [user_id], function (err, rows) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(rows)
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
    getLastPosition: function (connection, device_key) {
        return new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM `logger` WHERE `device_key`=? ORDER BY `date` DESC LIMIT 1 ', [device_key], (err, rows) => {
                if(err){
                    reject(err);
                    return;
                }
               // rows[0].name = device.name;
                resolve (rows[0])

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
                console.log('results ->', results);
                resolve(results);
            })
        })
    },
    getPrivateArea: function (connection, user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `private_area` WHERE `user_id`=? order by `id` desc limit 150';
            connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        })
    },
    removePrivateArea: function (connection, area_id) {

        return new Promise((resolve, reject) => {
            const query = 'DELETE from `private_area` WHERE `id` = ?';
            connection.query(query, [area_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    },
    addPrivateArea: function (connection, user_id, area) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `private_area` ' +
              '(`id`, `user_id`, `lng`, `lat`, `radius`) VALUES (NULL, ?, ?, ?, ?)', [user_id, area.lng, area.lat, area.radius], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log('results ->', results);
                resolve(results);
            })
        })
    },
    lockPrivateArea: function (connection, user_id, lock) {
        return new Promise((resolve, reject) => {
            lock = lock ? 1 : 0;
            connection.query('UPDATE `setting` SET setting.lock = ? WHERE user_id = ? ', [lock, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve()
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
    getUsersNotSelf:function (connection, user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT `id`,`name`,`image` from `user` WHERE `id` != ? order by `id` desc limit 150';
            connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });

    },
    onInviteFromToId: function (connection, user_id, invite_user_id) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO `invite` ' +
                '(`id`, `user_id`, `invite_user_id`, `active`) ' +
                'VALUES (NULL, ?, ?, ?)', [user_id, invite_user_id, true], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            })
        })
    },
    getInvites: function (connection, user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT user_id, image, name from `user` INNER JOIN `invite` ON invite.user_id = user.id AND invite.invite_user_id=? ';
            connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    },
    getOwnerDevice: function (connection, device_key) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT user.id, device.name from `user` INNER JOIN `device` ON device.user_id = user.id AND device_key=? ';
            connection.query(query, [device_key], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    },
    getMyInvites: function (connection, user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `invite` WHERE `user_id` = ?  order by `id` desc limit 150';
            connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    },
    
    delFriend(connection, user_id, friend_id){
       const fr1 = new Promise((resolve, reject) => {
            const query = 'DELETE from `friends` WHERE `user_id` = ? AND `friend_id`= ?';
            connection.query(query, [user_id, friend_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
       const fr2 = new Promise((resolve, reject) => {
            const query = 'DELETE from `friends` WHERE `user_id` = ? AND `friend_id`= ?';
            connection.query(query, [friend_id, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
       return Promise.all([fr1, fr2])
    },

    getInviteByOwnerId: function (connection, user_id, friend_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `invite` WHERE `user_id` = ? AND `invite_user_id`=?  order by `id` desc limit 1';
            connection.query(query, [friend_id, user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
    },
    getUserImageById: function (connection, user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * from `user` WHERE `id` = ? order by `id` desc limit 1';
            connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                if(rows && rows.length){
                    resolve(rows[0].image)    
                }else{
                    reject('no user->', rows)
                }
                
            })
        });
    },
    setFriends: function (connection, user_id, friend_id) {
        const fr1 = new Promise((resolve, reject) => {
            connection.query('INSERT INTO `friends` ' +
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
            connection.query('INSERT INTO `friends` ' +
                '(`id`, `user_id`, `friend_id`) ' +
                'VALUES (NULL, ?, ?)', [friend_id ,user_id ], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            })
        });
        return Promise.all([fr1, fr2])
    },
    delInvite:function (connection, id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `invite` WHERE `id`=?', [id], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result)
            })
        })
    },
    delInviteByUserId:function (connection, id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM `invite` WHERE `user_id`=?', [id], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result)
            })
        })
    },
    getFriends: function (connection, user_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT user.id, image, name from `user` INNER JOIN `friends` ON friends.friend_id = user.id AND friends.user_id = ?';
            connection.query(query, [user_id], (err, rows) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows)
            })
        });
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
            src: d.src,
            name: d.name
        }
    },
    getHash : function () {
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
    },
    clearHash: function (hash) {
        hashKeys.splice(hashKeys.indexOf(hash), 1)
    }

};


function getRandom(min, max, int) {
    var rand = min + Math.random() * (max - min);
    if (int) {
        rand = Math.round(rand)
    }
    return rand;
}