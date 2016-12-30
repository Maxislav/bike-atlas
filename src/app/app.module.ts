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
import {AuthComponent} from "./component/auth-component/auth.component";
import {MapComponent} from "./map.component";
import {InfoPositionComponent} from "./component/info-position/info-position-component";
import {MenuComponent} from "./component/menu/menu.component";
import {LocalStorage} from "./service/local-storage.service";
import {MenuTrackComponent} from "./component/menu/menu-track/menu-track.component";
import {Io} from "./service/socket.oi.service";
import {TrackService} from "./service/track.service";
import {TrackList} from "./component/menu/track-list/track-list.component";
import {MenuLoginComponent} from "./component/menu/menu-login/menu-login.component";
import {RegistrationComponent} from "./component/registration/registration.component";
import {Md5} from "./service/md5.service";
import {ToastComponent, ToastService} from "./component/toast/toast.component";
import {DeviceComponent} from "./component/device/device.component";
import {AuthService} from "./service/auth.service";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing
    ],
    /**
     * Компоненты
     */
    declarations: [
        //LeafletMapDirective,
        //DashboardComponent,
        RegistrationComponent,
        InfoPositionComponent,
        MapComponent,
        AuthComponent,
        AppComponent,
        HeroDetailComponent,
        HeroesComponent,
        MenuComponent,
        MenuTrackComponent,
        MenuLoginComponent,
        TrackList,
        ToastComponent,
        DeviceComponent

    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        TransactionResolver,
        MenuComponent,
        LocalStorage,
        Io,
        TrackService,
        Md5,
        ToastService,
    AuthService]
})
export class AppModule {}
