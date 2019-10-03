import { Component, HostBinding, OnInit } from '@angular/core';
import { PopupInstance, PopupInterface, PopupService } from 'src/app/modules/popup-module/popup.service';
import { popupMaskInAnimation } from 'src/app/modules/popup-module/popup-animation';


@Component({
    selector: 'popup-container',
    templateUrl: './popup-container.component.html',
    styleUrls: [
        './popup-container.component.less'
    ],
    animations: [popupMaskInAnimation]
})
export class PopupContainerComponent implements OnInit {
    //public visible: false
    // @HostBinding('ngIf')
    isShowMask = false;
    popupList: Array<any> = [];
    public popupService: PopupService;

    constructor() {
    }

    ngOnInit(): void {
        this.popupList = this.popupService.popupList;
    }

    onClose(popup: PopupInterface) {
        this.popupService.remove(popup);
    }

    animationEnd(e) {
        if (e.toState === 'void') {
            this.popupService.removeMask();
        }
        if (e.fromState === 'void') {
            this.popupService.animationShowEnd()
        }
        // console.log(e, 'dsjdlkihfoids\a')
    }


}
