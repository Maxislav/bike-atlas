System.register(['angular2/core', './services/service.menu'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, service_menu_1;
    var MenuList;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (service_menu_1_1) {
                service_menu_1 = service_menu_1_1;
            }],
        execute: function() {
            MenuList = (function () {
                function MenuList(serviceMenu) {
                    this.serviceMenu = serviceMenu;
                }
                MenuList.prototype.onRegist = function () {
                    this.serviceMenu.enterRegistShow = true;
                };
                MenuList = __decorate([
                    core_1.Component({
                        selector: '.menu-list',
                        templateUrl: 'app/template/menu-list.html',
                    }), 
                    __metadata('design:paramtypes', [service_menu_1.ServiceMenu])
                ], MenuList);
                return MenuList;
            })();
            exports_1("MenuList", MenuList);
        }
    }
});
//# sourceMappingURL=menu.list.js.map