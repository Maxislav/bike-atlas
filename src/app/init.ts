import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule, TestModule} from './app.module';
import {environment} from '../environments/environment';
import {hmrBootstrap} from '../hmr';
//
// if (environment.production) {
//     enableProdMode();
// }

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

declare const module: any;
bootstrap().catch(err => {
        console.log(err);
    }
);