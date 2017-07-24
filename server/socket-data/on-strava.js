const FormData = require('form-data');
const ProtoData = require('./proto-data');
const https = require('https');
const Stream = require('stream');
const request = require('request');
var querystring = require('querystring');
const fs = require('fs');
const path = require('path');

class OnStrava extends ProtoData {
    constructor(socket, util) {
        super(socket, util);
        socket.on('onStrava', this.onStrava.bind(this, 'onStrava'))
        socket.on('getStrava', this.getStrava.bind(this, 'getStrava'));
        socket.on('stravaUpdateCode', this.stravaUpdateCode.bind(this, 'stravaUpdateCode'))
        socket.on('stravaOauth', this.stravaOauth.bind(this, 'stravaOauth'))
        socket.on('isAuthorizeStrava', this.isAuthorize.bind(this, 'isAuthorizeStrava'))
        socket.on('sendTrackToStrava', this.sendTrackToStrava.bind(this, 'sendTrackToStrava'))
        socket.on('onDeauthorizeStrava', this.onDeauthorizeStrava.bind(this, 'onDeauthorizeStrava'))

    }


    sendTrackToStrava(eName, d) {
        const filePath =   path.normalize(__dirname+'/../../temp-gpx/'+ this.util.getHash()+'.gpx');

        const data = querystring.stringify({
            activity_type: 'ride',
            data_type: 'gpx',
        });


        const formData = new FormData();

        const ws = fs.createWriteStream(filePath);

        ws.on('finish', ()=>{
            const rs =  fs.createReadStream(filePath);
            formData.append('file', rs);
            formData.append('data_type', 'gpx');
            formData.append('activity_type', 'ride');


            const options = {
                port: 443,
                hostname: 'www.strava.com',
                method: 'POST',
                path: '/api/v3/uploads',
                headers: formData.getHeaders()
            };

            options.headers['Authorization'] = d.authorization


            let resData = '';
            const req = https.request(options, (res) => {
                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    resData += chunk;
                });
                res.on('error', (err) => {
                    console.log(err)
                });
                res.on('end', () => {
                    fs.unlink(filePath)
                    let jsonRes = {};
                    try {
                        jsonRes = JSON.parse(resData)
                    } catch (err) {
                        this.socket.emit(eName, {
                            result: false,
                            data: err
                        });
                        return
                    }
                    console.log(jsonRes);
                    if(jsonRes.id){
                        this.socket.emit(eName, {
                            result: 'ok',
                            data: jsonRes
                        });
                    }else {
                        this.socket.emit(eName, {
                            result: false,
                            data: jsonRes
                        });
                    }

                })
            });
            formData.pipe(req);
        });

        ws.end(d.file, (err, result)=>{

        });

    }

    isAuthorize(eName) {
        this.stravaOauth(eName);
    }

    stravaOauth(eName) {

        this.getUserId()
            .then(userId => {
                return this.util.getStrava(userId)
                    .then(row => {

                        row = ProtoData.toCamelCaseObj(row);

                        // -F
                        const data = querystring.stringify({
                            client_id: row.stravaClientId,
                            client_secret: row.stravaClientSecret,
                            code: row.stravaCode
                        });


                        const options = {
                            port: 443,
                            hostname: 'www.strava.com',
                            method: 'POST',
                            path: '/oauth/token',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Content-Length': Buffer.byteLength(data)
                            }
                        };
                        let resData = '';

                        const req = https.request(options, (res) => {
                            res.setEncoding('utf8');
                            res.on('data', (chunk) => {
                                resData += chunk;
                            });
                            res.on('end', () => {
                                let jsonRes = {};
                                try {
                                    jsonRes = JSON.parse(resData)
                                } catch (err) {
                                    console.log('Error parse Json->', err)


                                    this.socket.emit(eName, {
                                        result: false,
                                        data: err
                                    });
                                    return;
                                }

                                if (jsonRes.access_token) {
                                    this.socket.emit(eName, {
                                        result: 'ok',
                                        data: jsonRes
                                    });
                                } else {
                                    this.socket.emit(eName, {
                                        result: false,
                                        data: jsonRes
                                    });
                                }

                            })
                        });
                        req.write(data);
                        req.end()


                    })
            })


    }

    stravaUpdateCode(eName, code) {
        this.getUserId()
            .then(userId => {
                return this.util.stravaUpdateCode(userId, code)
                    .then(d => {
                        this.socket.emit(eName, {
                            result: 'ok'
                        })
                    })
            })
            .catch(error => {
                console.error('Error stravaUpdateCode ->', error)
            })

    }

    onStrava(eName, {stravaClientId, stravaClientSecret, atlasToken}) {
        this.getUserId()
            .then(userId => {
                return this.util.onStrava(userId, stravaClientId, stravaClientSecret, atlasToken)
            })
            .then(d => {
                this.socket.emit(eName, {
                    result: 'ok'
                })
            })
            .catch(error => {
                console.error('Error onStrava ->', error)
            })


    }

    getStrava(eName) {
        this.getUserId()
            .then(userId => {
                return this.util.getStrava(userId)

            })
            .then(row => {
                this.socket.emit(eName, {
                    result: 'ok',
                    data: row ? ProtoData.toCamelCaseObj(row) : null
                })
            })


    }
    onDeauthorizeStrava(eName, authorization){

      /*  const data = querystring.stringify({
            client_id: row.stravaClientId,
            client_secret: row.stravaClientSecret,
            code: row.stravaCode
        });*/


        const options = {
            port: 443,
            hostname: 'www.strava.com',
            method: 'POST',
            path: '/oauth/deauthorize',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': authorization
            }
        };
        
        let resData = '';

        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                resData += chunk;
            });
            res.on('end', () => {
                let jsonRes = {};
                try {
                    jsonRes = JSON.parse(resData)
                } catch (err) {
                    console.log('Error parse Json->', err)

                    this.socket.emit(eName, {
                        result: false,
                        data: err
                    });
                    return;
                }

                this.socket.emit(eName, {
                    result: 'ok',
                    data: jsonRes
                });
            })
        });
        req.end();
        this.getUserId()
          .then(userId => {
              this.util.onDeauthorizeStrava(userId)
          })
          .catch(error => {
              console.error('Error onDeauthorizeStrava ->', error)
          })
    }

}
module.exports = OnStrava;