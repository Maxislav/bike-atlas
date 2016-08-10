/**
 * Created by maxislav on 10.08.16.
 */
const exec = require('child_process').exec;
exec("zip -P \"g\" maptoken.zip -r maptoken.json", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});