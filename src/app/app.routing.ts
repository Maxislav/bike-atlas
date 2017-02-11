/**
 * Created by maxislav on 05.10.16.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HeroesComponent} from './heroes.component';
//import {DashboardComponent} from "./dasboard.component";
//import {HeroDetailComponent} from "./my-hero-detail.component";
//import {Hero} from "./hero";
//import {HEROES, Hero} from "./hero";
import {TransactionResolver} from "./transaction.resolve";
import {AuthComponent} from "./component/auth-component/auth.component";
import {MapComponent} from "./map.component";
import {RegistrationComponent} from "./component/registration/registration.component";
import {DeviceComponent} from "./component/device/device.component";
import {AuthService} from "./service/auth.service";
import {ProfileComponent} from "./component/profile/profile.component";
import {JournalComponent, LeafletResolver} from "./component/journal-component/journal.component";
import {FriendsComponent} from "./component/friends-component/friends-component";
import {PrivateArea} from "./component/private-area/private-area";
import {MapResolver} from "./directive/mapbox-gl.directive";
import {NoFoundComponent} from "./no-found.component";
import {AllUserComponent} from "./component/all-user/all-user.component";
import {StravaComponent} from "./component/strava-component/strava-component";

const  appRouters: Routes = [
    {
        path: '',
        redirectTo: 'auth/map',
        pathMatch: 'full'
    },

    {
        path: 'auth',
        component: AuthComponent,
        resolve:  {
            transactions : AuthService
        },
        children:[
            {
                path:''
            },
            {
                path:'map',
                component: MapComponent,
                children: [
                    {
                        path: ''
                    },
                    {
                        path:'registration',
                        component: RegistrationComponent
                    },
                    {
                        path:'device',
                        component: DeviceComponent
                    },
                    {
                        path: 'profile',
                        component:ProfileComponent
                    },
                    {
                        path: 'journal',
                        component: JournalComponent,
                        resolve:  {
                            L : LeafletResolver
                        },
                    },
                    {
                        path: 'friends',
                        component: FriendsComponent,
                        children: [
                            {
                                path:'',
                            },
                            {
                                path:'all',
                                component: AllUserComponent
                            }

                        ]
                    },
                    {
                        path: 'privatearea',
                        component: PrivateArea,

                    },
                    {
                        path:'strava-invite',
                        component: StravaComponent
                    },
                    {
                        path:'strava-invite/:token',
                        component: StravaComponent
                    },
                ]
            }
        ]
        
    },

    {
        path:'404',
        component: NoFoundComponent
    },
    {
        path: '**',
        redirectTo: '404',
    },
    {
        path: 'heroes',
        component: HeroesComponent
    },
    /*{
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            {
                path:''
            },
            {
                path:'k',
                component: HeroDetailComponent,
                resolve:  {
                    transactions :TransactionResolver
                }

            }

        ]

    }*/
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRouters, {useHash: true});
