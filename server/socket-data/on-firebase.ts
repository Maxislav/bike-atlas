import {autobind} from '../util/autobind';
import {SSocket} from '../socket-data';
import * as http from 'http';


export class MyFirebase{
    constructor(private socket: SSocket, private util){
        socket.$get('update-location', this.onFireBaseRegister)
    }

    @autobind()
    onFireBaseRegister(req, res){
        const data = req.data;
        this.util.getFireBaseToken(req.data.device_key)
            .then(row => {
                if(row){
                    return this.post(row.token)
                }
                else {
                    return Promise.reject( {
                        message: 'Device is not registered'
                    })
                }
            })
            .then((d: Buffer) => {
                d.toString()
                res.end({
                    success: {
                        message: 'ok'
                    }
                })
            })
            .catch(e => {
                res.end({
                    error: {
                        message: e.message || 'Unknown error',
                        data: JSON.stringify(e)
                    }
                })
            })

    }

    private post(token: string): Promise<Buffer>{

        const options = {
            hostname: 'localhost',
            port: 8082,
            path: `/?id=000&token=${token}`,
            method: 'GET',
        };
        return new Promise((res, rej) => {
            const proxyRequest = http.request(options);
            const chunks: Buffer[] = [];
            proxyRequest.on('response', function(proxyResponse) {
                proxyResponse.on('data', function(chunk: Buffer) {
                    chunks.push(chunk)
                });
                proxyResponse.on('end', function() {
                    // res.send(Buffer.concat(chunks))
                    res(Buffer.concat(chunks))
                });
            });
            proxyRequest.on('error', function(err) {
                console.error('MyFirebase error ->', err);
                rej(err)
            });
            proxyRequest.end();
        })

    }
}
