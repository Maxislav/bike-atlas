import {
    ApplicationRef,
    ComponentFactoryResolver,
    Injectable,
    Injector,
} from '@angular/core';
import { ComponentRef } from '@angular/core/src/linker/component_factory';
import { PopupContainerComponent } from 'src/app/modules/popup-module/popup-container.component';
import { PopupItemComponent } from 'src/app/modules/popup-module/popup-item.component';


export interface PopupButton {
    label: string,
    windowClass: string,

    click(popupItemComponent: PopupItemComponent): boolean
}

export interface PopupInstance {
    title: string;
    component: any;
    buttons: Array<PopupButton>;

}

@Injectable()
export class PopupInitialState {
    params: any;
}

export interface PopupInterface {
    body: any;
    title: string,
    initialParams: any,
    windowClass: string,
    buttons: Array<PopupButton>
}


@Injectable()
export class PopupService {

    public popupList: Array<PopupInterface> = [];
    popupContainerEl: HTMLElement;
    popupContainerRef: ComponentRef<PopupContainerComponent>;

    private popupListPrepare: Array<PopupInterface> = [];

    constructor(
        private injector: Injector,
        private applicationRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver
    ) {

    }

    init() {

    }

    private containerCreate() {
        const factory = this.componentFactoryResolver.resolveComponentFactory(PopupContainerComponent);
        this.popupContainerEl = document.createElement('popup-container');
        this.popupContainerRef = factory.create(this.injector, [], this.popupContainerEl);
        document.body.appendChild(this.popupContainerEl);
        this.applicationRef.attachView(this.popupContainerRef.hostView);
    }

    show(popup: PopupInterface): void {

        this.popupListPrepare.push(popup);
        if (this.popupList.length == 0) {
            this.containerCreate();
            this.popupContainerRef.instance.isShowMask = true;
            this.popupContainerRef.instance.popupService = this;

        } else {
            this.animationShowEnd();
        }


        //this.popupList.push(popup)
    }

    /* popupPush(popup: PopupInterface){
         this.popupList.push(popup)
     }*/

    animationShowEnd() {
        while (this.popupListPrepare.length) {
            const p = this.popupListPrepare.splice(0, 1)[0];
            this.popupList.push(p);
        }

    }

    remove(popup: PopupInterface) {
        const index = this.popupList.indexOf(popup);
        this.popupList.splice(index, 1);
    }

    hideMask() {
        if (this.popupList.length < 1) {
            this.popupContainerRef.instance.isShowMask = false;
            //this.applicationRef.detachView(this.popupContainerRef.hostView);
            //document.body.removeChild(this.popupContainerEl)
        }
    }

    removeMask() {
        this.applicationRef.detachView(this.popupContainerRef.hostView);
        document.body.removeChild(this.popupContainerEl);
    }
}