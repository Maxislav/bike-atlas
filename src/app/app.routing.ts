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
import {AuthComponent} from "./auth.component";
import {MapComponent} from "./map.component";
import {RegistrationComponent} from "./component/registration/registration.component";

const  appRouters: Routes = [
    {
        path: '',
        redirectTo: 'auth/map',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthComponent,
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
                    }
                ]
            }
        ]
        
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


export const routing: ModuleWithProviders = RouterModule.forRoot(appRouters);