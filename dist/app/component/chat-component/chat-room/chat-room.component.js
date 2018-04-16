"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const deep_copy_1 = require("../../../util/deep-copy");
const chat_service_1 = require("../../../service/chat.service");
const friends_service_1 = require("../../../service/friends.service");
let ChatRoomComponent = class ChatRoomComponent {
    constructor(chatService, friendService, el) {
        this.chatService = chatService;
        this.friendService = friendService;
        this.el = el;
        this.mesLength = 0;
        this.myActiveMess = {
            id: null,
            text: '',
            isMy: true,
            viewed: true
        };
        this._keyUp = this.keyUp.bind(this);
    }
    ngOnChanges(s) {
        console.log('ChatRoomComponent ngOnChanges', s);
    }
    ngOnInit() {
        this.name = this.room.name;
        this.messages = this.room.messages;
        this.id = this.room.id;
        this.chatService.chatHistory(this.id);
        this.friendService.unBindChatUnViewed(this.id);
        this.chatService.resolveUnViewedIds(this.room.id);
    }
    ngAfterViewInit() {
        this.scrollEl = this.el.nativeElement.getElementsByClassName('scroll')[0];
    }
    ngDoCheck() {
        if (this.mesLength != this.messages.length) {
            this.mesLength = this.messages.length;
            setTimeout(() => {
                this.scrollEl.scrollTop = this.scrollEl.scrollHeight;
            }, 10);
        }
    }
    onSend() {
        const mess = deep_copy_1.deepCopy(this.myActiveMess);
        this.myActiveMess.text = '';
        this.chatService.onSend(this.id, mess);
    }
    keyUp(e) {
        if (e.keyCode == 13 && !e.ctrlKey) {
            this.onSend();
        }
    }
    onClose() {
        this.chatService.closeRoom(this.id);
    }
    onFocus() {
        document.addEventListener('keyup', this._keyUp);
    }
    onBlur() {
        document.removeEventListener('keyup', this._keyUp);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ChatRoomComponent.prototype, "room", void 0);
ChatRoomComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'chat-room',
        //template: '{{userId}}<textarea [(ngModel)]="myActiveMess"></textarea>'
        templateUrl: './chat-room.component.html',
        styleUrls: ['./chat-room.component.css']
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        friends_service_1.FriendsService,
        core_1.ElementRef])
], ChatRoomComponent);
exports.ChatRoomComponent = ChatRoomComponent;
//# sourceMappingURL=chat-room.component.js.map