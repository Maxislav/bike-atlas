/**
 * Created by maxislav on 10.08.16.
 */
const exec = require('child_process').exec;

toZip()
  .then(toCommit);

function toZip() {
  return new Promise((resolve, reject)=>{
    exec("zip -P \"g\" maptoken.zip -r maptoken.json", {timeout:1000}, (error, stdout, stderr) => {
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
function toCommit() {
  return new Promise((resolve, reject)=>{
    exec("git add . && git commit -m \"commit new zip pass\" && git push", {timeout:1000}, (error, stdout, stderr) => {
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

