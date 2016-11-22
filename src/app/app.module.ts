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
import {AuthComponent} from "./auth.component";
import {MapComponent} from "./map.component";
import {InfoPositionComponent} from "./info-position-component";
import {MenuComponent} from "./component/menu.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing
    ],
    declarations: [
        //LeafletMapDirective,
        InfoPositionComponent,
        MapComponent,
        AuthComponent,
        AppComponent,
        HeroDetailComponent,
        HeroesComponent,
        MenuComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [TransactionResolver]
})
export class AppModule {}
