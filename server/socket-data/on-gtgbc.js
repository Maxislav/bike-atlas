const path = require('path');
const https = require('https');
const ProtoData = require('./proto-data');

class OnGtgbc extends ProtoData{
    constructor(socket, util, logger, chat) {
        super(socket, util);

        this.socket.on('onGtgbc', this.onGtgbc.bind(this, 'onGtgbc'))
    }

    onGtgbc(eName, array){
        Promise.all(array.map(mc => {
            return this.getLatLng(mc);
        }))
            .then(d=>{
                this.socket.emit(eName, {
                    result: d
                })
            })
    }

    getLatLng(mc){
        return new Promise((resolve, reject) => {
            https.get(`https://cellphonetrackers.org/gsm/classes/Cell.Search.php?mcc=${mc.mcc}&mnc=${mc.mnc}&lac=${mc.lac}&cid=${mc.cellId}`, (proxyResponse) => {
                let resData = '';
                proxyResponse.on('data', function(chunk) {
                    resData += chunk;
                });
                proxyResponse.on( 'end', function () {
                    resData.toString();
                    //res.sendFile(path.resolve(__dirname, 'index.html' ));
                    resolve(resData.toString())
                } );

            }).on('error', (e) => {
                console.error(e);
                reject(e);
            });
        })
    }
}

module.exports = OnGtgbc