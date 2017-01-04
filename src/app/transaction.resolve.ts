/**
 * Created by maxislav on 07.10.16.
 */

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {Hero, HEROES} from "./hero";



@Injectable()
export class TransactionResolver implements Resolve<Promise< Hero[]>> {
    constructor() {

    }
    resolve () : Promise<Hero[]>{
        return new Promise<Hero[]>(resolve => {
            setTimeout(() => {
                resolve(HEROES)
            }, 1000)
        })
    }
}