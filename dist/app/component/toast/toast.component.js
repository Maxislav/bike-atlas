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
class Message {
    constructor(type, className, text, translate) {
        this.type = type || 'default';
        this.className = type || 'default';
        this.text = text;
        if (translate)
            this.translate = translate;
    }
    remove() { }
}
exports.Message = Message;
;
let ToastService = class ToastService {
    constructor() {
        this.messages = [];
    }
    show(message) {
        const mess = new Message(message.type, message.className, message.text, message.translate);
        //message.className = message.type || 'default';
        const res = {
            remove: () => {
                const index = this.messages.indexOf(mess);
                if (-1 < index) {
                    this.messages.splice(index, 1);
                }
            }
        };
        mess.remove = res.remove;
        this.messages.push(mess);
        setTimeout(() => {
            res.remove();
        }, 5000);
        return res;
    }
};
ToastService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], ToastService);
exports.ToastService = ToastService;
let ToastComponent = class ToastComponent {
    constructor(ts) {
        this.ts = ts;
        this.messages = ts.messages;
    }
};
ToastComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'toast-component',
        templateUrl: './toast-component.html',
        styleUrls: [
            './toast.component.css',
        ]
    }),
    __metadata("design:paramtypes", [ToastService])
], ToastComponent);
exports.ToastComponent = ToastComponent;
;
//# sourceMappingURL=toast.component.js.map