/**
 * Created by maxislav on 05.10.16.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './component/auth-component/auth.component';
import { MapComponent } from './map.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { DeviceComponent } from './component/device/device.component';
import { AuthService } from './service/auth.service';
import { ProfileComponent } from './component/profile/profile.component';
import { JournalComponent, LeafletResolver } from './component/journal-component/journal.component';
import { FriendsComponent } from './component/friends-component/friends-component';
import { PrivateArea } from './component/private-area/private-area';
import { NoFoundComponent } from './no-found.component';
import { AllUserComponent } from './component/all-user/all-user.component';
import { StravaComponent } from './component/strava-component/strava-component';
import { StravaAuthComponent } from './component/strava-component/strava-auth-component';
import { GtgbcComponent } from './component/gtgbc/gtgbc.component';
import { DeviceHelpComponent } from './component/device/device-help/device-help.component';
import { OneUserComponent } from 'src/app/component/all-user/one-user/one-user.component';
import {MapService} from './service/map.service';

const appRouters: Routes = [
    {
        path: '',
        redirectTo: 'auth/map',
        pathMatch: 'full'
    },

    {
        path: 'auth',
        component: AuthComponent,
        canActivate: [AuthService],
        children: [
            {
                path: 'map',
                component: MapComponent,
                children: [
                    {
                        path: 'registration',
                        component: RegistrationComponent
                    },
                    {
                        path: 'device',
                        component: DeviceComponent,
                        children: [
                            {
                                path: ':device',
                                component: DeviceHelpComponent
                            }
                        ]
                    },
                    {
                        path: 'profile',
                        component: ProfileComponent,
                    },
                    {
                        path: 'journal',
                        component: JournalComponent,
                        resolve: {
                            L: LeafletResolver,
                        },
                    },
                    {
                        path: 'friends',
                        component: FriendsComponent,
                        children: [
                            {
                                path: 'all',
                                component: AllUserComponent
                            },
                            {
                                path: ':id',
                                component: OneUserComponent
                            }

                        ]
                    },
                    {
                        path: 'privatearea',
                        component: PrivateArea,

                    },
                    {
                        path: 'strava-invite',
                        component: StravaComponent,
                    },
                    {
                        path: 'strava-invite/:token',
                        component: StravaAuthComponent
                    },
                    {
                        path: 'gtgbc',
                        component: GtgbcComponent
                    },
                    {
                        path: 'gtgbc/:gtgbc',
                        component: GtgbcComponent
                    }
                ]
            }
        ]

    },

    {
        path: '404',
        component: NoFoundComponent
    },
    {
        path: '**',
        redirectTo: '404',
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


//export const MyRouterModule: ModuleWithProviders = RouterModule.forRoot(appRouters, {useHash: true});


@NgModule({
    imports: [RouterModule.forRoot(appRouters, { useHash: true, relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class MyRouterModule {
}
