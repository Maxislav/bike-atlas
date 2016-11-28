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
//import {DashboardComponent} from "./dasboard.component";
import {TransactionResolver} from "./transaction.resolve";
import {AuthComponent} from "./auth.component";
import {MapComponent} from "./map.component";
import {InfoPositionComponent} from "./component/info-position/info-position-component";
import {MenuComponent} from "./component/menu/menu.component";
import {LocalStorage} from "./service/local-storage.service";
import {MenuTrackComponent} from "./component/menu/menu-track/menu-track.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing
    ],
    declarations: [
        //LeafletMapDirective,
        //DashboardComponent,
        InfoPositionComponent,
        MapComponent,
        AuthComponent,
        AppComponent,
        HeroDetailComponent,
        HeroesComponent,
        MenuComponent,
        MenuTrackComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [TransactionResolver, MenuComponent, LocalStorage
    ]
})
export class AppModule {}
