module.exports = {
    getUserIdByHash: function (connection, hash) {
        return new Promise((resolve, reject)=>{
            connection.query('SELECT * FROM `hash` WHERE `key`=?', [hash], (err, rows)=>{
                if(err){
                    reject(err);
                    return;
                }
                resolve(rows[0]);
            });
        })
    },
    getUserNameById:   function (connection, id) {
            return new Promise((resolve, reject)=>{
                connection.query('SELECT * FROM `user` WHERE `id`=?', [id], (err, rows)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(rows[0]);
                });
            })
        }

};
