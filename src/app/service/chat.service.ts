

import {Injectable} from "@angular/core";
import {Room} from "../component/chat-component/chat-room/chat-room.component";
import {User} from "./main.user.service";
import {Io} from "./socket.oi.service";




@Injectable()
export class ChatService{
    rooms: Array<Room> = [];
    roomsObj: {[id:number]:Room} = {};
    private socket;
    constructor(private io: Io){
        this.socket = io.socket;
    }

    onEnterRoom(user: User){
        this.rooms.forEach(room=>{
            room.isActive = false
        });
        if (this.roomsObj[user.id]){
            this.roomsObj[user.id].isActive = true
        }else{
            const room = {
                name: user.name,
                id: user.id,
                messages: [],
                isActive : true
            };
            this.roomsObj[user.id] = room;
            
            this.rooms.push(room);
        }

    }
    onSend(outId: number, text: String): Promise<any>{
        return this.socket.$emit('onChatSend', {
            id: outId,
            text
        })
            
    }
    
}

