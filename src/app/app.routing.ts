/**
 * Created by maxislav on 05.10.16.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HeroesComponent} from './heroes.component';

const  appRouters: Routes = [
    {
        path: '',
        redirectTo: 'heroes',
        pathMatch: 'full'
    },
    {
        path: 'heroes',
        component: HeroesComponent
    }
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRouters);