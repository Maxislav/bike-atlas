import {Component, View} from 'angular2/core';
import {MyMap} from './mymap'
import {FooterHelp} from './footer.help'
import {Menu} from './menu.title';
import {MenuList} from "./menu.list";

@Component({
    selector: 'my-app',
})
@View({
    templateUrl: 'app/template/index.html',
    directives: [MyMap, FooterHelp, Menu, MenuList],
})

export class AppComponent {
    public title = 'Menu';
}
