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
const core_1 = require("@angular/core");
const friends_service_1 = require("../../service/friends.service");
const chat_service_1 = require("../../service/chat.service");
let AllUserComponent = class AllUserComponent {
    constructor(friendsService, chatService) {
        this.friendsService = friendsService;
        this.chatService = chatService;
        this.allUsers = friendsService.users;
        this.friends = friendsService.friends;
        this.invites = friendsService.invites;
        this.myInvites = friendsService.myInvites;
        friendsService.getAllUsers();
    }
    sendInvite(user) {
        this.friendsService.onInvite(user.id);
    }
    onReject(user) {
        this.friendsService.onRejectInvite(user.id);
    }
    onCancelInvite(user) {
        this.friendsService.onCancelInvite(user.id);
    }
    isInviteActive(user) {
        let i = 0;
        while (i < this.myInvites.length) {
            if (this.myInvites[i].invite_user_id == user.id) {
                return true;
            }
            i++;
        }
        return false;
    }
    isFriend(user) {
        let i = 0;
        while (i < this.friends.length) {
            if (this.friends[i].id == user.id) {
                return true;
            }
            i++;
        }
        return false;
    }
    startChat(user) {
        this.chatService.onEnterRoom(user);
    }
};
AllUserComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: './all-user.component.html',
        styleUrls: ['./all-user.component.css'],
    }), 
    __metadata('design:paramtypes', [friends_service_1.FriendsService, chat_service_1.ChatService])
], AllUserComponent);
exports.AllUserComponent = AllUserComponent;
//# sourceMappingURL=all-user.component.js.map