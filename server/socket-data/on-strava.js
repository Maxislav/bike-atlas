const  ProtoData = require('./proto-data');
const https = require('https');
var querystring = require('querystring');

class OnStrava extends ProtoData{
    constructor(socket, util) {
        super(socket, util);
        socket.on('onStrava', this.onStrava.bind(this, 'onStrava'))
        socket.on('getStrava', this.getStrava.bind(this, 'getStrava'));
        socket.on('stravaUpdateCode', this.stravaUpdateCode.bind(this, 'stravaUpdateCode'))
        socket.on('stravaOauth', this.stravaOauth.bind(this, 'stravaOauth'))

    }

    stravaOauth(eNAme, {stravaClientId, stravaClientSecret, stravaCode}){
        const data = querystring.stringify({
            client_id: stravaClientId,
            client_secret: stravaClientSecret,
            code: stravaCode
        });


        const options = {
            port: 443,
            hostname: 'www.strava.com',
            method: 'POST',
            //path: '/oauth/token?client_id='+stravaClientId+"&client_secret="+stravaClientSecret+"&code="+stravaCode
            path: '/oauth/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        };
           let resData = '';

        const req = https.request(options, (res)=> {
            res.setEncoding('utf8');
            res.on('data',  (chunk) =>{
                resData+=chunk;
            });
            res.on('end', ()=>{
                let jsonRes ={};
                try {
                    jsonRes = JSON.parse(resData)
                }catch (err){
                    console.log('Error parse Json->', err)
                    this.socket.emit(eNAme,{
                        result: false,
                        data: err
                    });
                    return;
                }
                this.socket.emit(eNAme,{
                    result: 'ok',
                    data: jsonRes
                });
            })
        });
        req.write(data);
        req.end()


    }

    stravaUpdateCode(eName, code){
        this.getUserId()
            .then(userId=>{
                return this.util.stravaUpdateCode(userId, code)
                    .then(d=>{
                        this.socket.emit(eName, {
                            result: 'ok'
                        })
                    })
            })
            .catch(error=>{
                console.error('Error stravaUpdateCode ->', error)
            })

    }
    onStrava(eName, {stravaClientId, stravaClientSecret, atlasToken}){
        this.getUserId()
            .then(userId=>{
                return this.util.onStrava(userId, stravaClientId, stravaClientSecret, atlasToken)
            })
            .then(d=>{
                this.socket.emit(eName,{
                    result: 'ok'
                })
            })
            .catch(error=>{
                console.error('Error onStrava ->', error)
            })



    }
    getStrava(eName){
        this.getUserId()
            .then(userId=>{
                return this.util.getStrava(userId)

            })
            .then(row=>{
                this.socket.emit(eName,{
                    result: 'ok',
                    data: row ? ProtoData.toCamelCaseObj(row): null
                })
            })



    }

}
module.exports = OnStrava;