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
let MenuListComponent = class MenuListComponent {
    constructor(ref) {
        this.ref = ref;
        this.isShow = false;
        this.menu = [];
        this.documentClick = this.documentClick.bind(this);
    }
    onClose() {
        //console.log('djsldj')
        //this.isShow = false
    }
    onOpen() {
        this.isShow = true;
        setTimeout(() => {
            document.removeEventListener('click', this.documentClick);
            document.addEventListener('click', this.documentClick);
        }, 100);
        this.ref.tick();
    }
    documentClick() {
        this.isShow = false;
        document.removeEventListener('click', this.documentClick);
    }
    onAction(e, item) {
        console.log('djsdkl');
        e.stopPropagation();
        if (item.action(this.item)) {
            this.isShow = false;
            document.removeEventListener('click', this.documentClick);
        }
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], MenuListComponent.prototype, "menu", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], MenuListComponent.prototype, "item", void 0);
__decorate([
    core_1.HostListener('document:click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MenuListComponent.prototype, "onClose", null);
MenuListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'menu-list-component',
        templateUrl: './menu-list-component.html',
        styleUrls: ['./menu-list-component.css']
    }),
    __metadata("design:paramtypes", [core_1.ApplicationRef])
], MenuListComponent);
exports.MenuListComponent = MenuListComponent;
//# sourceMappingURL=menu-list-component.js.map