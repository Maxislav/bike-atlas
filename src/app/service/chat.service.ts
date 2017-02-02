

import {Injectable} from "@angular/core";
import {Room, Message} from "../component/chat-component/chat-room/chat-room.component";
import {User} from "./main.user.service";
import {Io} from "./socket.oi.service";
import {Deferred} from "../util/deferred";

interface ResMessage {
    userId: number
    id: number | null
    text: String,
    isMy: boolean,
    date: Date,
    viewed: boolean
}



@Injectable()
export class ChatService{
    rooms: Array<Room> = [];
    messages: {[roomId:number]:Array<Message>}={};
    roomsObj: {[id:number]:Room} = {};
    private socket;
    unViewedDefer: Deferred;
    constructor(private io: Io){
        this.socket = io.socket;
        this.socket.on('onChat', this.onChat.bind(this))
        this.unViewedDefer = new Deferred()
    }

    onChat(data: ResMessage){
        console.log(data)
        this.putMessage(data.userId, {
            id: data.id,
            text: data.text,
            date: new Date(data.date),
            isMy:false,
            viewed: data.viewed
        })
    }

    getUnViewed(){
        if(this.unViewedDefer.status==0){
            this.socket.$emit('chatUnViewed')
                .then(d=>{
                    console.log(d)
                    this.unViewedDefer.resolve(d)
                })
        }
        return this.unViewedDefer.promise
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
    clearRoomMessage(roomId: number){
        this.messages[roomId].length = 0
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
             console.log(d)
             this.putMessage(d.toUserId, {
                 id: d.id,
                 text: d.text,
                 isMy: true,
                 date: new Date(d.date),
                 viewed: true
             })
         })
            
    }
    closeRoom(id: number){
        const index = this.rooms.indexOf(this.roomsObj[id]);
        if(-1<index){
            this.rooms.splice(index,1)
            delete this.roomsObj[id]
            this.clearRoomMessage(id)
        }
    }

    chatHistory(userId: number){
        this.socket.$emit('chatHistory', userId)
            .then(arr=>{
                arr.forEach(mes=>{
                    this.putMessage(userId, {
                        date: new Date(mes.date),
                        text: mes.text,
                        isMy: mes.isMy,
                        id: mes.id,
                        viewed: mes.viewed
                    })
                });
                console.log(arr)
            })
    }
    
}

