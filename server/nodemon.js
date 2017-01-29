/**
 * Created by max on 29.01.17.
 */
const nodemon = require('nodemon');
const fs = require('fs');
nodemon({
   script: 'server/index.js',
   // stdout: false // important: this tells nodemon not to output to console
}).on('readable', function() { // the `readable` event indicates that data is ready to pick up
    const errS = fs.createWriteStream('err.txt')
    this.stdout.pipe(fs.createWriteStream('output.txt'));
    this.stderr.pipe(errS);


}).on('stderr', function(e) { // the `readable` event indicates that data is ready to pick up

    console.log('->   ',e)

})