import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuListComponent} from './menu-list-component/menu-list-component';
import {ToastModule} from './toast-module/toast.module';
import {MyTranslateModule} from './translate-module/translate.module';

@NgModule({
    imports: [
        CommonModule,
        MyTranslateModule,
    ],
    declarations: [
        MenuListComponent
    ],
    providers: [],
    exports: [
        MenuListComponent,
        ToastModule,
        MyTranslateModule
    ]
})
export class SharedModule {

}

