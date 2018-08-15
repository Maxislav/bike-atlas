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
let MyInputPopupComponent = class MyInputPopupComponent {
    constructor(elRef, ref) {
        this.elRef = elRef;
        this.ref = ref;
        this.onSave = new core_1.EventEmitter();
    }
    ngOnInit() {
        console.log('init');
    }
    ngAfterViewInit() {
        if (!this.id) {
            this.elRef.nativeElement.getElementsByTagName('input')[0].focus();
        }
    }
    onChange() {
        this.ref.tick();
    }
    focusOut() {
        this.onSave.emit(this);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], MyInputPopupComponent.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], MyInputPopupComponent.prototype, "id", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], MyInputPopupComponent.prototype, "onSave", void 0);
MyInputPopupComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-input-popup-component',
        template: '<input class="input" type="text" [(ngModel)]="title" ' +
            '(ngModelChange)="onChange()"' +
            '(focusout)="focusOut()"' +
            '/>',
        styleUrls: ['./my-input-popup-component.css']
    }),
    __metadata("design:paramtypes", [core_1.ElementRef,
        core_1.ApplicationRef])
], MyInputPopupComponent);
exports.MyInputPopupComponent = MyInputPopupComponent;
//# sourceMappingURL=my-input-popup-component.js.map