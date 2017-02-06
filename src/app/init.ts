import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import {HashLocationStrategy} from "@angular/common";

import {enableProdMode} from '@angular/core';
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);