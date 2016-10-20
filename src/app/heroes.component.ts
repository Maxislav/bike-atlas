/**
 * Created by maxislav on 05.10.16.
 */
import { Component } from '@angular/core';
import {HeroService} from "./hero.service";

@Component({
    //selector: 'my-heroesw',
    //templateUrl: 'src/app/template/my-app.html'
    template: '<div>My-heroes</div>'
    //providers: [HeroService]
})
export class HeroesComponent{
        constructor(){
            console.log('ololo')
        }
}