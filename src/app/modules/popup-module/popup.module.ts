import { NgModule, OnInit } from '@angular/core';
import { PopupService } from 'src/app/modules/popup-module/popup.service';
import { PopupContainerComponent } from 'src/app/modules/popup-module/popup-container.component';
import { CommonModule } from '@angular/common';
import { PopupItemComponent } from 'src/app/modules/popup-module/popup-item.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [
        PopupContainerComponent,
        PopupItemComponent
    ],
    providers: [
        PopupService
    ],
    entryComponents: [
        PopupContainerComponent,
        PopupItemComponent
    ]
})
export class PopupModule {
    constructor(popupService: PopupService){
        //popupService.init();
    }


}

