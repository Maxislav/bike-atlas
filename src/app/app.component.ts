import { Component } from '@angular/core';
import {Hero} from './hero';

import {HeroService} from './hero.service';

@Component({
    selector: 'my-app',
    templateUrl: 'src/app/template/my-app.html',
    providers: [HeroService]
})


export class AppComponent {
    title = 'Tour of Heroes';


    herosss: Hero = {
        id: 0,
        name: ''
    };

    heroes:  Hero[]; //= HEROES;
    selectedHero: Hero;

    constructor(private heroService: HeroService){
        this.selectedHero = this.herosss;
        //heroService.getHeroes().then(heroes => this.heroes = heroes);
        heroService.getHeroesSlowly().then(heroes => this.heroes = heroes);
    }

    onSelect(hero: Hero) { this.selectedHero = hero; }

}
