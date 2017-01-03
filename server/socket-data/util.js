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
    updateSocketIdByHash: function(connection, hash, socket_id){
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
        return new Promise((resolve, reject)=>{
            connection.query('DELETE FROM `hash` WHERE `key`=?', [hash], (err, result) =>{
                if(err){
                    reject(err);
                    return;
                }
               /* const index = hashKeys.indexOf(data.hash);
                if(-1<index){
                    hashKeys.splice(index,1)
                }*/
                resolve(result)
            })
        })
    },
    getDeviceByHash: function (connection, hash) {
      return this.getUserIdByHash(connection, hash)
          .then(user_id=>{
              return new Promise((resolve, reject)=>{
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

    }

};
