"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gtgbc = void 0;
const path = require("path");
const https = require("https");
function gtgbc(req, res) {
    https.get('https://cellphonetrackers.org/gsm/classes/Cell.Search.php?mcc=0255&mnc=001&lac=1813&cid=18557', (proxyResponse) => {
        let resData = '';
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
        proxyResponse.on('data', function (chunk) {
            resData += chunk;
        });
        proxyResponse.on('end', function () {
            resData.toString();
            res.sendFile(path.resolve(__dirname, 'index.html'));
        });
    }).on('error', (e) => {
        console.error(e);
    });
}
exports.gtgbc = gtgbc;
;
//# sourceMappingURL=index.js.map