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
const common_1 = require("@angular/common");
const friends_service_1 = require("../../service/friends.service");
const toast_component_1 = require("../toast/toast.component");
const router_1 = require("@angular/router");
const chat_service_1 = require("../../service/chat.service");
const app_component_1 = require("../../app.component");
let UsersContainer = class UsersContainer {
    constructor(el, renderer) {
        let w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
        renderer.setElementStyle(el.nativeElement, 'max-height', y - 160 + 'px');
    }
};
UsersContainer = __decorate([
    core_1.Directive({
        selector: 'users-container',
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
], UsersContainer);
exports.UsersContainer = UsersContainer;
let FriendsComponent = class FriendsComponent {
    constructor(location, friendsService, lh, route, toast, router, chatService) {
        this.location = location;
        this.friendsService = friendsService;
        this.lh = lh;
        this.route = route;
        this.toast = toast;
        this.router = router;
        this.chatService = chatService;
        this.allUsers = friendsService.users;
        this.invites = friendsService.invites;
        this.friends = friendsService.friends;
        this.myInvites = friendsService.myInvites;
        friendsService.getFriends();
    }
    onAccept(friend) {
        this.friendsService.onAcceptInvite(friend);
    }
    onDelFriend(friend) {
        this.friendsService.onDelFriend(friend.id);
    }
    onClose() {
        if (this.lh.is) {
            this.location.back();
        }
        else {
            this.router.navigate(['/auth/map']);
        }
    }
    getAllUsers() {
        this.router.navigate(['/auth/map/friends/all']);
    }
    onReject(user) {
        this.friendsService.onRejectInvite(user.id);
    }
    onCancelInvite(user) {
        this.friendsService.onCancelInvite(user.id);
    }
    startChat(user) {
        this.chatService.onEnterRoom(user);
    }
};
FriendsComponent = __decorate([
    core_1.Component({
        //noinspection TypeScriptUnresolvedVariable
        moduleId: module.id,
        templateUrl: './friends-component.html',
        styleUrls: ['./friends-component.css'],
    }),
    __metadata("design:paramtypes", [common_1.Location,
        friends_service_1.FriendsService,
        app_component_1.NavigationHistory,
        router_1.ActivatedRoute,
        toast_component_1.ToastService,
        router_1.Router,
        chat_service_1.ChatService])
], FriendsComponent);
exports.FriendsComponent = FriendsComponent;
//# sourceMappingURL=friends-component.js.map