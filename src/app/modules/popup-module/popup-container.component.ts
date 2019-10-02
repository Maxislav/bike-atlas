import { Component, HostBinding, OnInit } from '@angular/core';
import { PopupInstance, PopupInterface, PopupService } from 'src/app/modules/popup-module/popup.service';



@Component({
    selector: 'popup-container',
    templateUrl: './popup-container.component.html',
    styleUrls: [
        './popup-container.component.less'
    ]
})
export class PopupContainerComponent implements OnInit{
    //public visible: false
    // @HostBinding('ngIf')
    ngIf: boolean;
    popupList: Array<any> = [];
    public popupService: PopupService;
    constructor(){
    }

    ngOnInit(): void {
        this.popupList = this.popupService.popupList;
    }
    onClose(popup: PopupInterface){
        this.popupService.hide(popup)
    }

}
