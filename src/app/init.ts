import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import {enableProdMode} from 'angular2/core';
//enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);