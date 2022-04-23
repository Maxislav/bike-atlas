import { SSocket } from '../socket-data';
import { Util } from '../socket-data/util';
import { autobind } from '../util/autobind';
import {ProtoData} from './proto-data';

export class OnMyMarker extends ProtoData {

    socket: SSocket;
    util: Util;

    constructor(socket, util) {
        super(socket, util);

        this.socket.$get('getMarkerList', this.getMarkerList);

        this.socket.on('saveMyMarker', this.saveMyMarker.bind(this, 'saveMyMarker'));
        this.socket.on('removeMyMarker', this.removeMyMarker.bind(this, 'removeMyMarker'));
    }

    @autobind()
    getMarkerList(req, res){
        this.util.getUserIdBySocketId(this.socket.id)
            .then((user_id) => {
                return this.util.getMyMarker(user_id)
            })
            .then(rows => {
                res.end(rows)
            })
    }

    saveMyMarker(eName, data) {
        console.log('saveMyMarker ->  ', data);
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.saveMyMarker(user_id, data)
            })
            .then((res: any) => {
                this.socket.emit(eName, {...data, ...{id: res.insertId}})
            })
            .catch(err=>{
                console.log('Err save marker', err)
            })

    }

    /**
     * @param {string} eName
     * @param {{id: number}} data
     */
    removeMyMarker(eName, data){
        this.util.getUserIdBySocketId(this.socket.id)
            .then(user_id => {
                return this.util.removeMyMarker(user_id, data.id)
            })
            .then(()=>{
                this.socket.emit(eName, {result: 'ok'})
            })
            .catch((e)=>{
                this.socket.emit(eName, {error: e})
            })
    }

}

//module.exports = OnMyMarker;
