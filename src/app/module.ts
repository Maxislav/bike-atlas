/**
 * Created by maxislav on 16.08.16.
 */
import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';

import {AppComponent}  from './app.component';
import {HeroDetailComponent}  from './my-hero-detail.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        HeroDetailComponent
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
