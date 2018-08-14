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
var _a;
const core_1 = require("@angular/core");
const map_service_1 = require("app/service/map.service");
const my_input_popup_component_1 = require("app/component/my-marker-list-component/my-input-popup-component/my-input-popup-component");
let MyMarkerService = class MyMarkerService {
    constructor(mapService, injector, applicationRef, componentFactoryResolver) {
        this.mapService = mapService;
        this.injector = injector;
        this.applicationRef = applicationRef;
        this.componentFactoryResolver = componentFactoryResolver;
        this.isShow = false;
        this.markerList = [];
    }
    show() {
        this.isShow = true;
    }
    hide() {
        this.isShow = false;
    }
    createMarker(lngLat, opts) {
        const { mapboxgl, map } = this.mapService;
        const icoContainer = document.createElement('div');
        const img = new Image();
        img.src = 'src/img/my-marker.png';
        img.style.width = '100%';
        img.style.height = '100%';
        icoContainer.appendChild(img);
        icoContainer.style.width = '40px';
        icoContainer.style.height = '40px';
        const inputContainer = document.createElement('div');
        inputContainer.style.padding = '15px';
        // inputContainer.style.background = 'white';
        const popup = new mapboxgl.Popup({
            offset: [0, -40]
        })
            .setLngLat([lngLat.lng, lngLat.lat])
            .setDOMContent(inputContainer);
        const marker = new mapboxgl.Marker(icoContainer, {
            offset: [-20, -40],
            draggable: true
        });
        marker.setLngLat([lngLat.lng, lngLat.lat])
            .addTo(map)
            .setPopup(popup)
            .togglePopup();
        const inputPopupRef = this.createInputPopup(inputContainer, opts.title);
        const myMarker = {
            id: opts.id,
            marker: marker,
            popup: popup,
            scope: inputPopupRef.instance,
            remove: () => {
                marker.remove();
                popup.remove();
                this.applicationRef.detachView(inputPopupRef.hostView);
                inputPopupRef.destroy();
                this.markerList.splice(this.markerList.indexOf(myMarker), 1);
                this.applicationRef.tick();
            }
        };
        this.markerList.push(myMarker);
        console.log(myMarker);
    }
    saveMarker(component) {
        const myMarker = this.markerList.find(({ scope }) => scope === component);
        console.log('save ->', myMarker);
    }
    createInputPopup(el, title) {
        const inputEl = document.createElement('my-input-popup-component');
        const factory = this.componentFactoryResolver.resolveComponentFactory(my_input_popup_component_1.MyInputPopupComponent);
        const inputRef = factory.create(this.injector, [], inputEl);
        inputRef.instance.title = title;
        inputRef.instance.onSave.subscribe(v => {
            this.saveMarker(v);
        });
        this.applicationRef.attachView(inputRef.hostView);
        el.appendChild(inputEl);
        return inputRef;
    }
};
MyMarkerService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof map_service_1.MapService !== "undefined" && map_service_1.MapService) === "function" && _a || Object, core_1.Injector,
        core_1.ApplicationRef,
        core_1.ComponentFactoryResolver])
], MyMarkerService);
exports.MyMarkerService = MyMarkerService;
//# sourceMappingURL=my-marker.service.js.map