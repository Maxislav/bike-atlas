


import {Component, Input, OnInit} from "@angular/core";
import {User} from "../../../service/main.user.service";
import {Stream} from "stream";
import {deepCopy} from "../../../util/deep-copy";
import {ChatService} from "../../../service/chat.service";



interface Message{
    id: number | null,
    text: String,
    isMy: boolean
    
}


interface Room{
    id: number;
    name: string
    myActiveMess: Message;
    messages: Array<Message>;
    isActive: boolean
}



@Component({
    moduleId: module.id, 
    selector: 'chat-room',
    //template: '{{userId}}<textarea [(ngModel)]="myActiveMess"></textarea>'
    templateUrl: './chat-room.component.html',
    styleUrls: ['./chat-room.component.css']

})
export class ChatRoomComponent implements OnInit{
    ngOnInit():void {
        this.name= this.room.name;
        this.messages = this.room.messages
        this.id = this.room.id
    }
    @Input() room: Room;
    name: String;
    messages:Array<Message>;
    myActiveMess: Message;
    constructor(private chatService: ChatService){
            this.myActiveMess = {
                id:null,
                text:'',
                isMy: true
            }
    }
    onSend(){
        const mess = deepCopy(this.myActiveMess)
        this.messages.push(mess);
        this.myActiveMess.text =''
        this.chatService.onSend(this.id, mess.text)
            .then(d=>{
                console.log(d)
            })


    }
}