import {Component} from "@angular/core";
import {ChatService} from "../../service/chat.service";
import {Room} from "./chat-room/chat-room.component";
declare  const module: any
@Component({
    selector: 'chat-component',
    templateUrl: './chat.component.html',
    moduleId: module.id,
    styleUrls: ['./chat.component.css']
})
export class ChatComponent{
    rooms: Array<Room>;

    constructor(private  chatService: ChatService){
        this.rooms = chatService.rooms
    }
}

