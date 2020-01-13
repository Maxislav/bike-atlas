/**
 * Created by maxislav on 16.08.16.
 */
import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent, NavigationHistory } from './app.component';
import { MyRouterModule } from './app.routing';
import { AuthComponent } from './component/auth-component/auth.component';
import { MapComponent } from './map.component';
import { InfoPositionComponent } from './component/info-position/info-position-component';
import { MenuComponent } from './component/menu/menu.component';
import { LocalStorage } from './service/local-storage.service';
import { MenuTrackComponent } from './component/menu/menu-track/menu-track.component';
import { Io } from './service/socket.oi.service';
import { TrackService } from './service/track.service';
import { TrackList } from './component/track-list/track-list.component';
import { MenuLoginComponent } from './component/menu/menu-login/menu-login.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { Md5 } from './service/md5.service';
import { ToastComponent, ToastService } from './component/toast/toast.component';
import { DeviceComponent } from './component/device/device.component';
import { AuthService } from './service/auth.service';
import { DeviceService } from './service/device.service';
import { LogService } from './service/log.service';
import { MarkerService } from './service/marker.service';
import { MapService } from './service/map.service';
import { MenuAthleteComponent } from './component/menu/menu-athlete/menu.athlete.component';
import { ProfileComponent } from './component/profile/profile.component';
import { JournalComponent, LeafletResolver } from './component/journal-component/journal.component';
import { FriendsComponent, UsersContainer } from './component/friends-component/friends-component';
import { FriendsService } from './service/friends.service';
import { UserService } from './service/main.user.service';
import { TimerService } from './service/timer.service';
import { PrivateArea } from './component/private-area/private-area';
import { MapResolver } from './directive/mapbox-gl.directive';
import { PrivateAreaService } from './service/private.area.service';
import { NoFoundComponent } from './no-found.component';
import { MapboxGlDirective } from './directive/mapbox-gl.directive';
import { HelpContainer } from './component/device/device.component';
import { OneTrack } from './component/journal-component/one-track.component/one-track.component';
import { JournalService } from './service/journal.service';
import { AllUserComponent } from './component/all-user/all-user.component';
import { ChatComponent } from './component/chat-component/chat.component';
import { ChatRoomComponent } from './component/chat-component/chat-room/chat-room.component';
import { ChatService } from './service/chat.service';
import { OneItemTrackComponent } from './component/track-list/one-item-track-component/one-item-track.component';
import { StravaComponent } from './component/strava-component/strava-component';
import { StravaAuthComponent } from './component/strava-component/strava-auth-component';
import { StravaService } from './service/strava.service';
import { Http, ConnectionBackend } from '@angular/http';

import { Component, Injectable } from '@angular/core';
import { MenuAthleteItemComponent } from './component/menu/menu-athlete/menu.athlete.item.component/menu.athlete.item.component';
import { MyMarkerListComponent } from './component/my-marker-list-component/my-marker-list-component';
import { MenuService } from './service/menu.service';
import { MyMarkerService } from './service/my-marker.service';
import { MyInputPopupComponent } from './component/my-marker-list-component/my-input-popup-component/my-input-popup-component';
import { SharedModule } from './shared-module/shared.module';
import { GtgbcComponent } from './component/gtgbc/gtgbc.component';
import { GtgbcService } from './api/gtgbc.service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IsOwner } from './component/device/device.component';
import { DashboardComponent } from './dasboard.component';
import { LeafletMapDirective } from './directive/leaflet-map.directive';
import { environment } from '../environments/environment';
import { DeviceHelpComponent } from './component/device/device-help/device-help.component';
import { DeviceIconComponent } from 'src/app/component/device-icon-component/device-icon-component';
import { PopupModule } from 'src/app/modules/popup-module/popup.module';
import { DeviceDelPopupComponent } from 'src/app/component/device/device-del-popup.component';
import { MyPopupDelMyMarker } from 'src/app/component/my-marker-list-component/my-popup-del-my-marker/my-popup-del-my-marker';
import { OneUserComponent } from './component/all-user/one-user/one-user.component';


@Component({
    //noinspection TypeScriptUnresolvedVariable
    template: '<div></div>',
    //providers: [OneTrack]
})
export class JJ {

}

/*

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, '/langs/', '.json');
}
*/


declare global {
    interface Navigator {
        userLanguage: string
    }
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, `${environment.hostPrefix}/langs/`, '.json');
}

/*


export class PipeTranslateCompiler implements TranslateCompiler {

    constructor(private injector: Injector, private errorHandler: ErrorHandler) {
    }

    public compile(value: string, lang: string): string | Function {
        return value;
    }

    public compileTranslations(translations: any, lang: string): any   {
        return translations;
    }
}
*/


@NgModule({
    imports: [
        PopupModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MyRouterModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        /*TranslateModule.forRoot(
            {
                compiler: {
                    provide: TranslateCompiler,
                    useClass: PipeTranslateCompiler,
                    deps: [Injector]
                },
            }
        ),*/
        SharedModule
    ],
    /**
     * Компоненты
     */
    declarations: [
        JJ,
        MyPopupDelMyMarker,
        DeviceHelpComponent,
        IsOwner,
        LeafletMapDirective,
        DashboardComponent,
        MyInputPopupComponent,
        MyMarkerListComponent,
        MenuAthleteItemComponent,
        StravaAuthComponent,
        StravaComponent,
        OneItemTrackComponent,
        ChatRoomComponent,
        ChatComponent,
        AllUserComponent,
        OneTrack,
        UsersContainer,
        RegistrationComponent,
        InfoPositionComponent,
        MapComponent,
        AuthComponent,
        AppComponent,
        HelpContainer,
        MenuComponent,
        MenuTrackComponent,
        MenuLoginComponent,
        MapboxGlDirective,
        TrackList,
        ToastComponent,
        DeviceComponent,
        MenuAthleteComponent,
        ProfileComponent,
        JournalComponent,
        FriendsComponent,
        PrivateArea,
        NoFoundComponent,
        GtgbcComponent,
        DeviceIconComponent,
        DeviceDelPopupComponent,
        OneUserComponent
    ],

    /** Сервисы */
    providers: [
        HttpClient,

        //ConnectionBackend,
        TranslateService,
        StravaService,
        ChatService,
        JournalService,
        LeafletResolver,
        MenuComponent,
        LocalStorage,
        Io,
        TrackService,
        Md5,
        ToastService,
        AuthService,
        DeviceService,
        LogService,
        MapService,
        MarkerService,
        FriendsService,
        UserService,
        TimerService,
        MapResolver,
        PrivateAreaService,
        NavigationHistory,
        MenuService,
        MyMarkerService,
        GtgbcService

    ],
    entryComponents: [
        MyInputPopupComponent,
        DeviceIconComponent,
        DeviceDelPopupComponent,
        MyPopupDelMyMarker
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
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
