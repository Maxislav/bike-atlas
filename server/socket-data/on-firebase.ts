import {autobind} from '../util/autobind';
import {SSocket} from '../socket-data';

export class MyFirebase{
    constructor(private socket: SSocket, private util){
        socket.$get('firebase', this.onFireBaseRegister)
    }

    @autobind()
    onFireBaseRegister(req, res){
        const data = req.data;
        this.util.getUserIdBySocketId(this.socket.id)

    }
}
