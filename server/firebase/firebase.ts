import {autobind} from '../util/autobind';
import {Express} from 'express';
import {Util} from '../socket-data/util';
import {Request, Response} from 'express-serve-static-core';

export class MyFireBase {
    constructor(app: Express, private util: Util) {
        console.log('MyFireBase path /firebase*')
        app.get('/firebase*', this.onFire)
    }

    @autobind()
    onFire(req: Request, res: Response, next) {

        let checkSum: string = ""
        const token: string = req.query.token as string
        const deviceId: string = req.query.id as string
       // const {token, id: deviceId}: {token: string, deviceId: string} = req.query

        console.log(`token: ${token}`)
        console.log(`deviceId: ${deviceId}`);
        try {
            checkSum = req.query.sum as string
        } catch (err) {
            console.error(err);
            res.status(500)
            return res.send(err)
        }
        if (checkSum) {
            this.saveToken(token, deviceId)
                .then(() => {
                    res.status(200)
                    return res.end(checkSum);
                })
                .catch(e => {
                    res.status(500)
                    return res.send("some err sum is not recognized")
                })

        }else {
            res.status(500)
            return res.send("Check sum is not recognized")
        }


    }

    saveToken(token: string, deviceId: string): Promise<string>{
        return this.util.saveFireBaseToken({
            token,
            deviceId,
        })

    }
}
