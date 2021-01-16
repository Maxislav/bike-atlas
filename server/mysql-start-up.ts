const mysql = require('mysql');
let config = require('./mysql.config.json');
let connection = null;


connect()
    .then(createDatabase)
    .then(connect)
    .then(createTable)
    .then(() => {
        connection.end();
        console.log("Success");
    })
    .catch((err) => {
        console.log(err);
        connection.end()
    });
//ALTER TABLE `logger` CHANGE `date` `date` datetime(2) NOT NULL

function connect() {
    connection = mysql.createConnection(config.mysql);
    return new Promise((resolve, reject) => {
        connection.connect(function (err) {
            if (err) {
                console.log('Error connecting to Db');
                reject(err);
                return;
            }
            resolve(connection)
        });
    })
}

function createDatabase() {
    return new Promise((resolve, reject) => {
        connection.query('CREATE DATABASE IF NOT EXISTS `monitoring` CHARACTER SET utf8 COLLATE utf8_general_ci', (err, rows, field) => {
            if (err) {
                console.log('Error createDatabase');
                reject(err);
            } else {
                config.mysql['database'] = 'monitoring';
                connection.end((err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(connection)
                });
            }
        });
    })
}

function createTable() {
    const tableUser = new Promise((res, rej) => {
        const query = 'CREATE TABLE IF NOT EXISTS `monitoring`.`user` ' +
            '( `id` INT(11) NOT NULL AUTO_INCREMENT , ' +
            '`name` VARCHAR(16) NOT NULL , ' +
            '`pass` VARCHAR(32) NOT NULL , ' +
            '`image` TEXT NULL DEFAULT NULL, ' +
            '`opt` VARCHAR(16) NULL DEFAULT NULL , ' +
            'PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error tableUser create');
                rej(err);
                return;
            }
            res(connection);
        })
    });

    const tableHash = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`hash` ' +
            '( `id` INT NOT NULL AUTO_INCREMENT , ' +
          '`user_id` INT NOT NULL, ' +
          '`socket_id` VARCHAR(32) NOT NULL, ' +
          '`key` VARCHAR(32) NULL,' +
          ' PRIMARY KEY (`id`)) ENGINE = InnoDB;';

        connection.query(query, (err) => {
            if (err) {
                console.log('Error  tableHash create');
                rej(err);
                return;
            }
            res(connection);
        })
    });

    const tableDevice = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`device` ' +
            '( `id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `device_key` VARCHAR(32) NOT NULL , ' +
            '`name` VARCHAR(32) NOT NULL, ' +
            '`phone` VARCHAR(32) NULL,  ' +
            '`image` TEXT NULL DEFAULT NULL, ' +
            ' PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error  tableDevice create');
                rej(err);
                return;
            }
            res(connection);
        })
    });


    const tableLogger = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`logger` ' +
            '( `id` INT NOT NULL AUTO_INCREMENT , ' +
            '`device_key` VARCHAR(32) NOT NULL , ' +
            '`lng` FLOAT(10,8) NOT NULL, ' +
            '`lat` FLOAT(10,8) NOT NULL, ' +
            '`alt` FLOAT(8,2) DEFAULT 0, ' +
            '`batt` INT(11) DEFAULT 0, ' +
            '`accuracy` FLOAT(16,8) DEFAULT 0, ' +
            '`base_station` VARCHAR(1024) NULL DEFAULT NULL, ' +
            '`speed` FLOAT(8,2) NULL DEFAULT NULL, ' +
            '`azimuth` FLOAT(6,2) NULL DEFAULT NULL, ' +
            '`date` DATETIME NOT NULL, ' +
            '`type` VARCHAR(15) NULL DEFAULT NULL, ' +
            '`src` VARCHAR(256) NULL DEFAULT NULL,' +
            'PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error  tableLogger create');
                rej(err);
                return;
            }
            res(connection);
        })
    });

    const tableSetting = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`setting` ' +
            '( `id` INT NOT NULL AUTO_INCREMENT , ' +
            '`user_id` INT NOT NULL , ' +
            '`map` VARCHAR(16) NULL DEFAULT NULL, ' +
            '`hill` BOOLEAN NOT NULL DEFAULT 0, ' +
            '`lock` BOOLEAN NOT NULL DEFAULT 0, ' +
            '`last_visit` DATETIME NULL DEFAULT NULL,' +
            'PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error table setting create');
                rej(err);
                return;
            }
            res(connection);
        })
    });
    const tableInvite = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`invite` ' +
            '( `id` INT NOT NULL AUTO_INCREMENT , ' +
            '`user_id` INT NOT NULL , ' +
            '`invite_user_id` INT NOT NULL, ' +
            '`active` BOOLEAN NOT NULL DEFAULT 0, ' +
            'PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error table invite create');
                rej(err);
                return;
            }
            res(connection);
        })
    });


    const tableFriends = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`friends` ' +
            '( `id` INT NOT NULL AUTO_INCREMENT , ' +
            '`user_id` INT NOT NULL , ' +
            '`friend_id` INT NOT NULL, ' +
            'PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error table friends create');
                rej(err);
                return;
            }
            res(connection);
        })
    });
    const tablePrivateArea = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`private_area` ' +
            '( `id` INT NOT NULL AUTO_INCREMENT , ' +
            '`user_id` INT NOT NULL UNIQUE, ' +
            '`lng` FLOAT(10,8) NOT NULL, ' +
            '`lat` FLOAT(10,8) NOT NULL  , ' +
            '`radius` FLOAT(10,8) NOT NULL, ' +
            'PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error table friends create');
                rej(err);
                return;
            }
            res(connection);
        })
    });

    const tableChat = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`chat` ' +
          '( `id` INT NOT NULL AUTO_INCREMENT , ' +
          '`from_user_id` INT NOT NULL , ' +
          '`to_user_id` INT NOT NULL , ' +
          '`text` TEXT COLLATE utf8_general_ci NULL DEFAULT NULL, ' +
          '`viewed` BOOLEAN NOT NULL DEFAULT 0, ' +
          '`date` DATETIME NOT NULL, ' +
          'PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error table chat create');
                rej(err);
                return;
            }
            res(connection);
        })
    });
    const tableStrava = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`strava` ' +
            '( `id` INT NOT NULL AUTO_INCREMENT , ' +
            '`user_id` INT NOT NULL UNIQUE, ' +
            '`strava_client_id` INT NOT NULL UNIQUE, ' +
            '`atlas_token` VARCHAR(32) NULL DEFAULT NULL, ' +
            '`strava_code` VARCHAR(40) NULL DEFAULT NULL, ' +
            '`strava_client_secret` VARCHAR(40) NULL DEFAULT NULL, ' +
            '`strava_access_token` VARCHAR(40) NULL DEFAULT NULL, ' +
            '`date` DATETIME NULL DEFAULT NULL,' +
            'PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error table chat create');
                rej(err);
                return;
            }
            res(connection);
        })
    });

    const tableMarker = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`marker` ' +
            '( `id` INT NOT NULL AUTO_INCREMENT , ' +
            '`user_id` INT NOT NULL, ' +
            '`image_id` INT NULL DEFAULT NULL, ' +
            '`lng` FLOAT(10,8) NOT NULL, ' +
            '`lat` FLOAT(10,8) NOT NULL  , ' +
            '`date` DATETIME NULL DEFAULT NULL,' +
            '`title` TEXT COLLATE utf8_general_ci NULL DEFAULT NULL,  ' +
            '`text` TEXT COLLATE utf8_general_ci NULL DEFAULT NULL, ' +
            '`shared` BOOLEAN NOT NULL DEFAULT 0, ' +
            'PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error table marker create');
                rej(err);
                return;
            }
            res(connection);
        })
    });

    const tableImage = new Promise((res, rej) => {
        const query = 'CREATE TABLE  IF NOT EXISTS `monitoring`.`image` ' +
            '( `id` INT NOT NULL AUTO_INCREMENT , ' +
            '`user_id` INT NOT NULL, ' +
            'PRIMARY KEY (`id`)) ENGINE = InnoDB;';
        connection.query(query, (err) => {
            if (err) {
                console.log('Error table image create');
                rej(err);
                return;
            }
            res(connection);
        })
    });




    return Promise.all([
        tableUser, 
        tableHash, 
        tableDevice, 
        tableLogger, 
        tableSetting, 
        tableInvite, 
        tableFriends,
        tableChat,
        tablePrivateArea,
        tableStrava,
        tableMarker,
        tableImage])
    //return Promise.all([tableHash])


}
