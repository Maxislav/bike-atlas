const net = require('net');
const streams = [];

var server = net.createServer((c) => {
    console.log('connect');
    streams.push(c);
    c.on('end', () => {
        console.log('client disconnected');
        const index = streams.indexOf(c);
        if(-1<index){
            streams.splice(index,1);
        }
    });
    c.on('data', function (onStreamData)  {
        console.log(onStreamData.toString())
        //c.write(`Echo server\r\n ${onStreamData.toString()}`);
        //c.end()
    });
});



server.listen(8090);