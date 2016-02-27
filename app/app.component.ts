import {Component} from 'angular2/core';
import {MyMap} from './mymap'

@Component({
    selector: 'my-app',
    templateUrl: 'app/template/index.html',
    directives: [MyMap]
})

export class AppComponent {
    public title = 'Menu';
}
