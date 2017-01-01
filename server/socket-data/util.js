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
    },
    getUserByHash: function (connection, hash) {
        return this.getUserIdByHash(connection, hash)
            .then((id)=>{
               return this.getUserById(connection, id)
            })
    }

};
