import { Component, Injectable } from '@angular/core';
import {MenuService} from "app/service/menu.service";
import {Io} from "app/service/socket.oi.service";
const ss = require('node_modules/socket.io-stream/socket.io-stream.js');
class Item {
    text: string;
    value: string;
}

const MENU: Item[] = [
    {
        value: 'load',
        text: "Загрузить"
    },
    {
        value: 'view',
        text: "Просмотреть"
    }
];

@Component({
    moduleId: module.id,
    selector: 'menu-track',
    templateUrl:'./menu-track.html',
    styleUrls: ['./menu-track.css'],
   // providers: [MenuService]
})
export class MenuTrackComponent{
    menu = MENU;
    private socket: any;
    constructor(private ms: MenuService, private io: Io){
        this.socket = io.socket
    }
    onSelect(item, $event){

        switch (item.value){
            case 'load':
                //console.log(t)
                $event.preventDefault();
                $event.stopPropagation();
                this.loadFile($event);
                //this.ms.menuLoadOpen = true;
                break;
            default:
                return null
        }

    }

    loadFile(e: Event){
        this.ms.menuOpen = false;
        let elFile:any = e.target.parentElement.getElementsByTagName('input')[1];
       // console.log(elFile)
        elFile.addEventListener('change', ()=>{
            let FReader = new FileReader();
            FReader.onload = function (e) {
                console.log(e)
            };
            var file = elFile.files[0];
            var stream = ss.createStream();
            ss(this.socket).emit('file', stream, {size: file.size});
            ss.createBlobReadStream(file).pipe(stream);
            this.ms.menuLoadOpen = false
        });

        elFile.addEventListener('click', (e)=>{
            // e.preventDefault()
            e.stopPropagation()
        });
        elFile.click()
    }
}