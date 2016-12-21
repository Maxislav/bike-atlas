/**
 * Created by maxislav on 10.08.16.
 */
const exec = require('child_process').exec;
const fs = require('fs');

getPass()
  .then(toZip)
  .then(toZipMysqlConfig)
  .then(toCommit);

function getPass() {
  return new Promise((resolve, reject)=>{

    fs.readFile('user-pass.json', 'utf8', function(err, contents) {
      if(err){
        console.log(err);
        reject();
        return
      }
      
      let json, pass;
      
      try{
        json = JSON.parse(contents)
      }catch (err){
        console.log(err);
        reject();
      }
      
      console.log(json.pass);
      resolve(json.pass)
    });
  })
}


function toZip(pass) {
  return new Promise((resolve, reject)=>{
    exec("zip -P \""+pass+"\" maptoken.zip -r maptoken.json", {timeout:1000}, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      resolve(pass)
    });
  })
}

function toZipMysqlConfig(pass) {
  return new Promise((resolve, reject)=>{
    exec("zip -P \""+pass+"\" ./server/mysql.config.json.zip -r ./server/mysql.config.json", {timeout:1000}, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      resolve(pass)
    });
  }).catch(err=>{
    console.error(err)
  })
}

function toCommit() {
  return new Promise((resolve, reject)=>{
    exec('git add . && git commit -m "commit new zip pass" && git push', {timeout:5000}, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      resolve('ok')
    });
  })
}

