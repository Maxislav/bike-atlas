import {Component, View} from 'angular2/core';
import {MyMap} from './mymap'
import {FooterHelp} from './footer.help'
import {Menu} from './menu.title';
import {MenuList} from "./menu.list";
import {EnterRegist} from "./enter-regist";

@Component({
    selector: 'my-app',
})
@View({
    templateUrl: 'app/template/index.html',
    directives: [MyMap, FooterHelp, Menu, MenuList, EnterRegist],
})

export class AppComponent {
    public title = 'Menu';
}
