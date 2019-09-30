import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    Injectable,
    Injector,
    ViewContainerRef
} from '@angular/core';
import { DeviceIconComponent } from 'src/app/component/device-icon-component/device-icon-component';
import { ComponentRef } from '@angular/core/src/linker/component_factory';
import { PopupContainerComponent } from 'src/app/modules/popup-module/popup-container.component';
import { ComponentDef } from '@angular/core/src/render3';


export interface PopupButton {
    label: string,
    windowClass: string,
    click(): boolean
}

export interface PopupInstance {
    title: string;
    component: any;
    buttons: Array<PopupButton>;

}/*
export class PopupInstance {
    title: string = '';
    component: any;
    buttons: Array<PopupButton> = [];
}*/


@Injectable()
export class PopupService {

    public popupList: Array<{component: any; buttons: Array<PopupButton>}> = [];
    popupContainerEl: HTMLElement;
    popupContainerRef: ComponentRef<PopupContainerComponent>;
    viewContainerRef: ViewContainerRef;

    constructor(
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {

    }

    init(viewContainerRef: ViewContainerRef) {
        this.viewContainerRef = viewContainerRef;
        //const appElement = this.injector.get(this.applicationRef.componentTypes)//.elementRef;
        //console.log(appElement)
    }

    private containerCreate() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(PopupContainerComponent);
        this.popupContainerEl = document.createElement('popup-container');
        this.popupContainerRef = factory.create(this.injector, [], this.popupContainerEl);
        this.viewContainerRef.insert(this.popupContainerRef.hostView);
        this.popupContainerRef.instance.ngIf = false;
    }

    show(component: any, buttons: Array<PopupButton> = []) {
        if(this.popupList.length==0){
            this.containerCreate();
            this.popupContainerRef.instance.ngIf = true;
            this.popupContainerRef.instance.popupService = this;
        }
        this.popupList.push({
            component,
            buttons
        })
    }
}