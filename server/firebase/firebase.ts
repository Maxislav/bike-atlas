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
        const {token, id: deviceId} = req.query

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
            res.status(200)
            return res.end(checkSum);
        }
        res.status(500)
        return res.send("Check sum is not recognized")

    }
}
