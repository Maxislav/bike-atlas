/**
 * Created by maxislav on 16.08.16.
 */
import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';

import {AppComponent}  from './app.component';
import {HeroDetailComponent}  from './my-hero-detail.component';
import {routing} from './app.routing';
import {HeroesComponent} from "./heroes.component";
import {DashboardComponent} from "./dasboard.component";
import {TransactionResolver} from "./transaction.resolve";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing
    ],
    declarations: [
        AppComponent,
        HeroDetailComponent,
        HeroesComponent,
        DashboardComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [TransactionResolver]
})
export class AppModule {}
