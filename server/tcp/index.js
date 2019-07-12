const net = require('net');
const fs = require('fs');
const path = require('path');
const streams = [];
const PORT = 8090;

const colors = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
};

Object.defineProperties(String.prototype, {
    yellow: {
        get: function () {
            return colors.FgYellow.concat(this).concat(colors.Reset)
        }
    },
    green: {
        get: function () {
            return colors.FgGreen.concat(this).concat(colors.Reset)
        }
    },
    blue: {
        get: function () {
            return colors.FgBlue.concat(this).concat(colors.Reset)
        }
    },
    red: {
        get: function () {
            return colors.FgRed.concat(this).concat(colors.Reset)
        }
    }
});


const writeToFile = (str) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(path.resolve(__dirname, 'log-file.txt'), str, function (err) {
            if (err) {
                console.log('Err write to file ->'.red, err);
                return reject(err)
            }
            resolve()
        });
    })
};

const server = net.createServer((c) => {
    console.log('connect', new Date().toISOString());
    streams.push(c);
    writeToFile(new Date().toISOString().concat('\r\n', 'connect', '\r\n'));
    c.on('end', () => {
        console.log('client disconnected');
        writeToFile(new Date().toISOString().concat('\r\n', 'disconnected', '\r\n'));
        const index = streams.indexOf(c);
        if (-1 < index) {
            streams.splice(index, 1);
        }
    });
    c.on('data', function (onStreamData) {
        let str = '';
        try {
            str = onStreamData.toString();
        } catch (e) {
            console.error(e);
            console.log('can\'t convert to string')
        }
        if (str) {
            writeToFile(new Date().toISOString().concat('\r\n', str, '\r\n'))
        }
        console.log(str);
    });
    c.on('error', (err) => {
        console.error(err)
    })
});


server.listen(PORT, () => {
    console.log('server is started'.yellow, `on port:`, `${PORT}`.green)
});