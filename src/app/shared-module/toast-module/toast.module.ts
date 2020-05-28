import {NgModule} from '@angular/core';
import {ToastComponent} from './components/toast/toast.component';
import {CommonModule} from '@angular/common';
import {ToastService} from './toast.service';
import {MyTranslateModule} from '../translate-module/translate.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        MyTranslateModule,
        TranslateModule,
    ],
    providers: [
        ToastService
    ],
    declarations: [ToastComponent],
    exports: [
        ToastComponent,
    ]
})
export class ToastModule {

}
