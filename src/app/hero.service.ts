/**
 * Created by maxislav on 18.08.16.
 */
import { Injectable } from '@angular/core';
import {HEROES, Hero} from "./hero";


@Injectable()
export class HeroService {
    getHeroes(){
        return   Promise.resolve(HEROES)
    }

    getHeroesSlowly(){
        return new Promise<Hero[]>(resolve => setTimeout(() => resolve(HEROES), 2000))
    }
}