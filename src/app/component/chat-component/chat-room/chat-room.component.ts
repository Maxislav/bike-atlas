


import {Component, Input, OnInit} from "@angular/core";
import {User} from "../../../service/main.user.service";
import {deepCopy} from "../../../util/deep-copy";
import {ChatService} from "../../../service/chat.service";



export interface Message{
    id: number | null,
    text: String,
    isMy: boolean,
    viewed: boolean,
    date?: Date
}


export interface Room{
    id: number;
    name: string
    messages: Array<Message>;
    isActive: boolean
}

declare const module: any

@Component({
    moduleId: module.id, 
    selector: 'chat-room',
    //template: '{{userId}}<textarea [(ngModel)]="myActiveMess"></textarea>'
    templateUrl: './chat-room.component.html',
    styleUrls: ['./chat-room.component.css']

})
export class ChatRoomComponent implements OnInit{
    private id: number;

    @Input() room: Room;
    name: String;
    messages:Array<Message>;
    myActiveMess: Message;
    constructor(private chatService: ChatService){
            this.myActiveMess = {
                id: null,
                text:'',
                isMy: true,
                viewed: true
            }
    }
    ngOnInit():void {
        this.name= this.room.name;
        this.messages = this.room.messages;
        this.id = this.room.id
        this.chatService.chatHistory(this.id)
    }
    onSend(){
        const mess = deepCopy(this.myActiveMess);
       // this.messages.push(mess);
        this.myActiveMess.text ='';
        this.chatService.onSend(this.id, mess);

    }
    onClose(){
        this.chatService.closeRoom(this.id)
    }
}