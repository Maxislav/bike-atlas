import * as ProtoData from './proto-data';
import { autobind } from '../util/autobind';
import { Util } from '../socket-data/util';


export class OnRegist extends ProtoData {
    logger;
    util: Util;


    constructor(private socket, private util, private logger) {
        super(socket, util);

        socket.on('onRegist', this.onRegist.bind(this));

        this.socket.$get('updatePass', this.updatePass);
    }

    onRegist(d) {

        this.util.onRegist(d)
            .then(d => {
                if (d && d.result == 'ok') {
                    this.socket.emit('onRegist', {
                        result: 'ok',
                        message: null
                    });
                } else {
                    this.socket.emit('onRegist', d);
                }

            }, err => {
                console.error(err);
            })
            .catch((err) => {
                console.error('Cache onRegist', err);
                this.socket.emit('onRegist', {result: false, status: 500, message: err});
            });
    }

    @autobind()
    updatePass(req, res){
        res.end({
            result: 'ok',
            data: req.data
        })
    }


}

