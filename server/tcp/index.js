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
        let str = '';
        try {
            str = onStreamData.toString()
        }catch (e) {
            console.error(e);
            console.log('can\'t convert to string')
        }
        console.log(str);
    });
});



server.listen(8090);