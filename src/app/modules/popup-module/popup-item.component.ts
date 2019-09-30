import { Component, Input, OnInit } from '@angular/core';
import { PopupButton, PopupInstance } from 'src/app/modules/popup-module/popup.service';

@Component({
    selector: 'popup-item-component',
    templateUrl: './popup-item.component.html',
    styleUrls: [
        './popup-item.component.less'
    ]
})
export class PopupItemComponent  implements OnInit{
    @Input() popup: {component: any; buttons: Array<PopupButton>};

    ngOnInit(): void {
        console.log(this.popup)
    }

}
