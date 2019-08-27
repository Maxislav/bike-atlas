import {Component} from "@angular/core";
import {ChatService} from "../../service/chat.service";
import {Room} from "./chat-room/chat-room.component";
@Component({
    selector: 'chat-component',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.less']
})
export class ChatComponent{
    rooms: Array<Room>;

    constructor(private  chatService: ChatService){
        this.rooms = chatService.rooms
    }

    sortByFn(index, item){
        return item.id
    }
}

