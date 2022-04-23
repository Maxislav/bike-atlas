import {autobind} from '../util/autobind';
import {Util} from '../socket-data/util';
import {Logger} from '../gps-logger/gps-logger';
import {ProtoData} from './proto-data';


interface RegistrationFormIs {
    name: string;
    pass: string;
    repeatPass: string
}

interface PassFormIs {
    currentPass: string;
    newPass: string;
    repeatNewPass: string;
}

export class OnRegist extends ProtoData {
    constructor(public socket, public util: Util, private logger: Logger) {
        super(socket, util);
        socket.on('onRegist', this.onRegist);
        this.socket.$get('updatePass', this.updatePass);
        this.socket.$get('onRegister', this.onRegister);
    }


    @autobind()
    onRegister(req: { data: RegistrationFormIs }, res: any) {
        console.log(req.data);
        const d = req.data;

        this.util.onRegist(d)

            .then(d => {
                if (d && d.result == 'ok') {
                    res.end({
                        result: 'success',
                        error: null
                    })
                } else {
                    res.end(d);
                }

            }, err => {
                console.error(err);
            })
            .catch((err) => {
                console.error('Cache onRegist', err);
                res.end({
                    result: false,
                    error: err.toString()
                })
                //this.socket.emit('onRegist', {result: false, status: 500, message: err});
            });
        /* res.end({
             result: 'ok',
             error: null
         })*/
    }

    @autobind()
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
    updatePass(req: {
        data: PassFormIs
    }, res) {
        this.util.getUserIdBySocketId(this.socket.id)
            .then((user_id) => {
                return this.util.getUserById(user_id);
            })
            .then(user => {
                if (req.data.currentPass === user.pass) {
                    return this.util.updatePassword(user.id, req.data.newPass, this.socket.id)
                        .then((rows) => {
                            res.end({
                                result: 'ok',
                                error: null,
                                data: rows
                            });
                        })

                } else {
                    res.end({
                        result: 'CURRENT_PASS_NOT_MATCH',
                        error: 'Current password does not match',
                    });
                }
            })
            .catch((err) => {
                res.end({
                    result: 'FAIL',
                    error: err.toString()
                })
            });

    }


    private updatePassSql() {

    }
}

