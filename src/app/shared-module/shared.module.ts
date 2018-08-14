import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuListComponent } from 'app/shared-module/menu-list-component/menu-list-component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MenuListComponent
    ],
    exports: [
        MenuListComponent
    ]
})
export class SharedModule {

}

