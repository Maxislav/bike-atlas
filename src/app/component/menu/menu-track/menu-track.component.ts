///<reference path="../../../../../node_modules/@angular/compiler/src/ml_parser/ast.d.ts"/>
import { Component, Injectable } from '@angular/core';
import {MenuService} from "app/service/menu.service";
import {Io} from "app/service/socket.oi.service";
const ss = require('node_modules/socket.io-stream/socket.io-stream.js');

const log = console.log

interface Item {
    text: string;
    value: string;
    enctype?:  string ;

}

interface myElement extends Element{
    click():void;
    files?: Array<File>
}
interface myEventTarget extends EventTarget{
    parentElement: myElement;
}
interface myEvent extends Event{
    target: myEventTarget
}


const MENU: Item[] = [
    {
        value: 'load',
        text: "Загрузить",
        enctype:"multipart/form-data",
    },
    {
        value: 'import',
        text: "Импорт from Google KML"
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
        $event.preventDefault();
        $event.stopPropagation();

        switch (item.value){
            case 'load':
                this.loadFile($event);
                break;
            case 'import':
                this.importFile($event);
                break;
            default:
                return null
        }

    }

    loadFile(e: Event){
        this.ms.menuOpen = false;
        const elFile: myElement = e.target.parentElement.getElementsByTagName('input')[1];
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
            e.stopPropagation()
        });
        elFile.click()
    }

    importFile(e: Event){

        this.ms.menuOpen = false;
        const elFile: myElement  = e.target.parentElement.getElementsByTagName('input')[1];

        elFile.addEventListener('change', ()=>{
          console.log('olol')

            let FReader = new FileReader();
            var file = elFile.files[0];
            upload(file)
        })

        elFile.addEventListener('click', (e)=>{
            e.stopPropagation()
        });
        elFile.click();

        function upload(file) {

            var xhr = new XMLHttpRequest();

            // обработчик для закачки
            xhr.upload.onprogress = function(event) {
                console.log(event.loaded + ' / ' + event.total);
            };

            // обработчики успеха и ошибки
            // если status == 200, то это успех, иначе ошибка
            xhr.onload = xhr.onerror = function() {
                if (this.status == 200) {
                    log("success");
                } else {
                    log("error " + this.status);
                }
            };

            xhr.open("POST", "/import/kml-data", true);
            xhr.send(file);

        }

    }
}