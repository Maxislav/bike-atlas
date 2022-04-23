"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
setTimeout(() => {
    let client = new net.Socket();
    client.connect(8090, 'localhost', () => {
        console.log("Connected");
        client.write('+RESP:GTSTR,440503,866427030059602,GL520,0,0,2,,4,0,98.2,83,156.2,30.275498,50.449775,20220223085319,0255,0001,0715,1403,,,0000,20220311205252,2B1C$'); //This will send the byte buffer over TCP
    });
}, 2000);
//# sourceMappingURL=client-test.js.map