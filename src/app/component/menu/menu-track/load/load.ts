/**
 * Created by maxislav on 30.11.16.
 */
import {MenuService} from 'app/service/menu.service'
import { Component} from "@angular/core"
import {Io} from "app/service/socket.oi.service";
import {MapService} from "app/service/map.service";
const ss = require('node_modules/socket.io-stream/socket.io-stream.js');
//import ss  from "node_modules/socket.io-stream/socket.io-stream.js"


//console.log(ss)
@Component({
    moduleId: module.id,
    selector: 'menu-track-load',
    templateUrl: './menu-load-track.html',
    //styles: [':host{position: absolute; z-index: 2}']
    styleUrls: ['./menu-load-track.css']
})
export class LoadTrack{


    private socket: any
   
    constructor(private ms: MenuService, private io: Io, mapSevice: MapService){
        this.socket = io.socket
    }
    onSelect(e){
        e.preventDefault();
        e.stopPropagation();
        e.target.parentElement.getElementsByTagName('input')[1].click()
    }
    onSubmit(e){
        e.preventDefault();
        e.stopPropagation();
        let fileSelect = e.target.parentElement.getElementsByTagName('input')[1];
        let FReader = new FileReader();
        FReader.onload = function (e) {
            console.log(e)
        };

        var file = fileSelect.files[0];
        var stream = ss.createStream();
       // console.log(file)

        ss(this.socket).emit('file', stream, {size: file.size});
        ss.createBlobReadStream(file).pipe(stream);

    }
}