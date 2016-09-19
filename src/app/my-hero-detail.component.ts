/**
 * Created by maxislav on 18.08.16.
 */
import { Component, Input } from '@angular/core';
import { Hero } from './hero'

@Component({
    selector: 'my-hero-detail',
    templateUrl: 'src/app/template/hero-detail-component.html'
})

export class HeroDetailComponent {
    @Input()
    hero: Hero;
}