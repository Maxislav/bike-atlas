


import {Component, Input, OnInit, AfterViewInit, ElementRef} from "@angular/core";
import {deepCopy} from "../../../util/deep-copy";
import {ChatService} from "../../../service/chat.service";
import {FriendsService} from "../../../service/friends.service";



export interface Message{
    id: number | null,
    text: String,
    isMy: boolean,
    viewed: boolean,
    date?: Date
}


export interface Room{
    id: string;
    name: string
    messages: Array<Message>;
    isActive: boolean
}
interface MyNode extends Node{
    scrollTop: any
    scrollHeight: any
}


@Component({
    selector: 'chat-room',
    //template: '{{userId}}<textarea [(ngModel)]="myActiveMess"></textarea>'
    templateUrl: './chat-room.component.html',
    styleUrls: ['./chat-room.component.less']

})
export class ChatRoomComponent implements OnInit, AfterViewInit{

    private id: string;

    @Input() room: Room;
    name: String;
    messages:Array<Message>;
    myActiveMess: Message;
    private mesLength: number = 0;

   private _keyUp: EventListener;
    private scrollEl: MyNode;

    constructor(private chatService:ChatService,
                private friendService:FriendsService,
                private el:ElementRef) {

            this.myActiveMess = {
                id: null,
                text:'',
                isMy: true,
                viewed: true
            };
        this._keyUp = this.keyUp.bind(this)
    }

    ngOnChanges(s){
        console.log('ChatRoomComponent ngOnChanges', s)
    }

    ngOnInit():void {
        this.name= this.room.name;
        this.messages = this.room.messages;
        this.id = this.room.id;
        this.chatService.chatHistory(this.id)
        //this.friendService.unBindChatUnViewed(this.id)
        this.chatService.resolveUnViewedIds(this.room.id)
    }
    ngAfterViewInit():void {
        this.scrollEl = this.el.nativeElement.getElementsByClassName('scroll')[0]
    }
    ngDoCheck(){
        if(this.mesLength!=this.messages.length){
            this.mesLength =  this.messages.length;
            setTimeout(()=>{
                this.scrollEl.scrollTop = this.scrollEl.scrollHeight
            }, 10)
        }
    }

    onSend(){
        const mess = deepCopy(this.myActiveMess);
        this.myActiveMess.text ='';
        this.chatService.onSend(this.id, mess);

    }
    private keyUp(e){
        if(e.keyCode == 13 && !e.ctrlKey){
            this.onSend()
        }
    }
    onClose(){
        this.chatService.closeRoom(this.id)
    }
    onFocus(){
        document.addEventListener('keyup', this._keyUp)
    }
    onBlur(){
        document.removeEventListener('keyup', this._keyUp)
    }

}