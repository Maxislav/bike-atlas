import {Component} from "@angular/core";
import {ChatService, Room} from "../../service/chat.service";
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

