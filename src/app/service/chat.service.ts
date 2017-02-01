

import {Injectable} from "@angular/core";
import {Room, Message} from "../component/chat-component/chat-room/chat-room.component";
import {User} from "./main.user.service";
import {Io} from "./socket.oi.service";

interface ResMessage {
    userId: number
    id: number | null
    text: String,
    isMy: boolean
}



@Injectable()
export class ChatService{
    rooms: Array<Room> = [];
    messages: {[roomId:number]:Array<Message>}={};
    roomsObj: {[id:number]:Room} = {};
    private socket;
    constructor(private io: Io){
        this.socket = io.socket;
        this.socket.on('onChat', this.onChat.bind(this))
    }

    onChat(data: ResMessage){
        console.log(data)
        this.putMessage(data.userId, {
            id: data.id,
            text: data.text,
            isMy:false

        })
    }

    getMessages(roomId: number){
        if(!this.messages[roomId]){
            this.messages[roomId] = []
        }
        return this.messages[roomId]
    }
    putMessage(roomId: number, message: Message){
        if(!this.messages[roomId]){
            this.messages[roomId] = []
        }
        this.messages[roomId].push(message)
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
                isActive : true,
                messages: this.getMessages(user.id)
            };
            this.roomsObj[user.id] = room;
            this.rooms.push(room);
        }

    }
    onSend(outId: number, message: Message): Promise<any>{
        return this.socket.$emit('onChatSend', {
            id: outId,
            text:message.text
        })
         .then(d=>{
             this.putMessage(d.toUserId, {
                 id: null,
                 text: d.text,
                 isMy: true
             })
         })
            
    }
    
}

