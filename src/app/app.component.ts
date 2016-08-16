import { Component } from '@angular/core';
@Component({
    selector: 'my-app',
    //template: '<h1>My First Angular 2 App</h1>'
    templateUrl: 'src/app/template/my-app.html'
})

export class AppComponent {
    title = 'Tour of Heroes';
    hero: Hero = {
        id: 1,
        name : 'Ololo'
    };
}

class Hero{
    id: number;
    name: string
};