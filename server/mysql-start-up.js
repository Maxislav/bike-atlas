const mysql      = require('mysql');
let config = require('./mysql.config.json');
let connection = null;


connect()
  .then(createDatabase)
  .then(connect)
  .then(createTable)
  .then(()=>{
    connection.end();
    console.log("Success");
  })
  .catch((err)=>{
    console.log(err);
    connection.end()
  });


function connect() {
  connection = mysql.createConnection(config.mysql);
  return new Promise((res, rej)=>{
    connection.connect(function(err){
      if(err){
        console.log('Error connecting to Db');
        rej(err);
        return;
      }
      res(connection)
    });
  })
}

function createDatabase() {
  return new Promise((resolve, reject)=>{
    connection.query('CREATE DATABASE IF NOT EXISTS `monitoring` CHARACTER SET utf8 COLLATE utf8_general_ci', (err, rows, field)=>{
      if(err) {
        console.log('Error createDatabase');
        reject(err);
      }else {
        config.mysql['database'] = 'monitoring';
        connection.end((err)=>{
          if(err){
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
  const tableUser =  new Promise((res, rej)=>{
    const query  = 'CREATE TABLE IF NOT EXISTS `monitoring`.`user` ' +
      '( `id` INT(11) NOT NULL AUTO_INCREMENT , `name` VARCHAR(16) NOT NULL , `pass` VARCHAR(32) NOT NULL , `opt` VARCHAR(16) NULL DEFAULT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;';
    connection.query(query, (err)=>{
      if(err){
        console.log('Error tableUser');
        rej(err);
        return;
      }
      res(connection);
    })
  });

  const tableHash = new Promise((res, rej)=>{
    const query = 'CREATE TABLE `monitoring`.`hash` ' +
      '( `id` INT NOT NULL AUTO_INCREMENT , `user_id` INT NOT NULL , `key` VARCHAR(32) NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;';

    connection.query(query, (err)=>{
      if(err){
        console.log('Error  tableHash');
        rej(err);
        return;
      }
      res(connection);
    })
  });
  
  return Promise.all([tableUser, tableHash])



}