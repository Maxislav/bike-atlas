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
var core_1 = require("@angular/core");
var common_1 = require('@angular/common');
var friends_service_1 = require("../../service/friends.service");
var toast_component_1 = require("../toast/toast.component");
var UsersContainer = (function () {
    function UsersContainer(el, renderer) {
        var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
        renderer.setElementStyle(el.nativeElement, 'height', y - 300 + 'px');
    }
    UsersContainer = __decorate([
        core_1.Directive({
            selector: 'users-container',
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], UsersContainer);
    return UsersContainer;
}());
exports.UsersContainer = UsersContainer;
var FriendsComponent = (function () {
    function FriendsComponent(location, friend, toast) {
        this.location = location;
        this.friend = friend;
        this.toast = toast;
        this.allUsers = friend.users;
        this.invites = friend.invites;
        this.friends = friend.friends;
    }
    FriendsComponent.prototype.onAccept = function (friend) {
        this.friend.onAcceptInvite(friend);
    };
    FriendsComponent.prototype.onDelFriend = function (friend) {
        this.toast.show({
            type: 'warning',
            text: "в рвзработке.."
        });
    };
    FriendsComponent.prototype.onClose = function () {
        this.location.back();
    };
    FriendsComponent.prototype.getAllUsers = function () {
        this.friend.getAllUsers();
    };
    FriendsComponent.prototype.sendInvite = function (user) {
        this.friend.onInvite(user.id);
    };
    FriendsComponent.prototype.isFriend = function (user) {
        var i = 0;
        while (i < this.friends.length) {
            if (this.friends[i].id == user.id) {
                return true;
            }
            i++;
        }
        return false;
    };
    FriendsComponent = __decorate([
        core_1.Component({
            //noinspection TypeScriptUnresolvedVariable
            moduleId: module.id,
            templateUrl: './friends-component.html',
            directives: [UsersContainer],
            styleUrls: ['./friends-component.css'],
        }), 
        __metadata('design:paramtypes', [common_1.Location, friends_service_1.FriendsService, toast_component_1.ToastService])
    ], FriendsComponent);
    return FriendsComponent;
}());
exports.FriendsComponent = FriendsComponent;
//# sourceMappingURL=friends-component.js.map