/**
 * Created by maxislav on 05.10.16.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HeroesComponent} from './heroes.component';
import {DashboardComponent} from "./dasboard.component";

const  appRouters: Routes = [
    {
        path: '',
        redirectTo: 'heroes',
        pathMatch: 'full'
    },
    {
        path: 'heroes',
        component: HeroesComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    }
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRouters);