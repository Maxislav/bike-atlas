import {NgModule} from '@angular/core';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, `${environment.hostPrefix}/langs/`, '.json');
}

@NgModule({
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ]
})
export class MyTranslateModule {
    constructor(private translate: TranslateService) {
        const userLang = navigator.language || navigator.userLanguage;
        const lang = userLang.match(/^\D{2}/)[0];
        switch (lang) {
            case'ru':
                translate.setDefaultLang('ru');
                break;
            case 'en':
            default:
                translate.setDefaultLang('en');
        }

    }
}
