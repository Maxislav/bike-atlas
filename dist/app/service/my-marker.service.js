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
var _a, _b, _c;
const core_1 = require("@angular/core");
const map_service_1 = require("app/service/map.service");
const my_input_popup_component_1 = require("app/component/my-marker-list-component/my-input-popup-component/my-input-popup-component");
const socket_oi_service_1 = require("app/service/socket.oi.service");
const toast_component_1 = require("app/component/toast/toast.component");
let MyMarkerService = class MyMarkerService {
    constructor(io, mapService, injector, applicationRef, componentFactoryResolver, toast) {
        this.io = io;
        this.mapService = mapService;
        this.injector = injector;
        this.applicationRef = applicationRef;
        this.componentFactoryResolver = componentFactoryResolver;
        this.toast = toast;
        this.isShow = false;
        this.markerList = [];
        this.socket = io.socket;
    }
    show() {
        this.isShow = true;
    }
    hide() {
        this.isShow = false;
    }
    addMarkers(markers) {
        this.mapService.onLoad
            .then(() => {
            const { LngLat } = this.mapService.mapboxgl;
            markers.forEach(m => {
                if (!this.markerList.find(({ id }) => id === m.id)) {
                    this.createMarker(new LngLat(m.lng, m.lat), m);
                }
            });
        });
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
        // inputContainer.style.padding = '15px';
        // inputContainer.style.background = 'white';
        const popup = new mapboxgl.Popup({
            offset: [0, -40]
        })
            .setLngLat([lngLat.lng, lngLat.lat])
            .setDOMContent(inputContainer);
        const marker = new mapboxgl.Marker(icoContainer, {
            offset: [0, -20],
            draggable: true
        });
        marker.setLngLat([lngLat.lng, lngLat.lat])
            .addTo(map)
            .setPopup(popup);
        if (!opts.id) {
            marker.togglePopup();
        }
        const inputPopupRef = this.createInputPopup(inputContainer, opts.title, opts.id);
        const myMarker = {
            id: opts.id,
            marker: marker,
            popup: popup,
            scope: inputPopupRef.instance,
            click: () => {
                map.flyTo({
                    center: [lngLat.lng, lngLat.lat],
                    zoom: map.getZoom() < 12 ? 12 : map.getZoom()
                });
            },
            remove: () => {
                marker.remove();
                popup.remove();
                this.applicationRef.detachView(inputPopupRef.hostView);
                inputPopupRef.destroy();
                this.markerList.splice(this.markerList.indexOf(myMarker), 1);
                this.applicationRef.tick();
                this.removeMarker(myMarker);
            }
        };
        this.markerList.push(myMarker);
        console.log(myMarker);
    }
    removeMarker(marker) {
        this.socket.$emit('removeMyMarker', {
            id: marker.id
        })
            .then((d) => {
            this.toast.show({
                type: 'success',
                text: 'Marker was removed'
            });
        })
            .catch(e => {
            console.log('Error remove marker -> ', e);
        });
    }
    saveMarker(component) {
        const myMarker = this.markerList.find(({ scope }) => scope === component);
        console.log('save ->', myMarker);
        this.socket.$emit('saveMyMarker', {
            id: myMarker.id,
            title: component.title,
            lngLat: myMarker.marker.getLngLat()
        })
            .then(d => {
            myMarker.id = d.id;
            this.toast.show({
                type: 'success',
                text: 'Marker was added'
            });
        })
            .catch(e => {
            console.log('Error save marker -> ', e);
        });
    }
    createInputPopup(el, title, id) {
        const inputEl = document.createElement('my-input-popup-component');
        const factory = this.componentFactoryResolver.resolveComponentFactory(my_input_popup_component_1.MyInputPopupComponent);
        const inputRef = factory.create(this.injector, [], inputEl);
        inputRef.instance.title = title;
        inputRef.instance.id = id;
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
    __metadata("design:paramtypes", [typeof (_a = typeof socket_oi_service_1.Io !== "undefined" && socket_oi_service_1.Io) === "function" && _a || Object, typeof (_b = typeof map_service_1.MapService !== "undefined" && map_service_1.MapService) === "function" && _b || Object, core_1.Injector,
        core_1.ApplicationRef,
        core_1.ComponentFactoryResolver, typeof (_c = typeof toast_component_1.ToastService !== "undefined" && toast_component_1.ToastService) === "function" && _c || Object])
], MyMarkerService);
exports.MyMarkerService = MyMarkerService;
//# sourceMappingURL=my-marker.service.js.map