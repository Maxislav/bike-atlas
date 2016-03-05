import {Component, View} from 'angular2/core';
import {MyMap} from './mymap'
import {FooterHelp} from './footer.help'
import {LatLngService} from "./services/service.lat.lng";

@Component({
    selector: 'my-app'
})
@View({
    templateUrl: 'app/template/index.html',
    directives: [MyMap,FooterHelp]
})

export class AppComponent {
    public title = 'Menu';
}
