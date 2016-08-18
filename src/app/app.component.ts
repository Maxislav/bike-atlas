import { Component } from '@angular/core';
import {Hero, HEROES} from './hero'

@Component({
    selector: 'my-app',
    templateUrl: 'src/app/template/my-app.html'
})


export class AppComponent {
    title = 'Tour of Heroes';


    herosss: Hero = {
        id: 0,
        name: ''
    };

    heroes:  Hero[] = HEROES;
    selectedHero: Hero;

    constructor(){
        this.selectedHero = this.herosss;
    }

    onSelect(hero: Hero) { this.selectedHero = hero; }

}
