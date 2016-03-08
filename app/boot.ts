import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {MymapEvents} from "./services/service.map.events";
import {LocalStorage} from "../lib/a2/local_storage";
import {ServiceMenu} from "./services/service.menu";

 var appPromise = bootstrap(AppComponent, [  MymapEvents , ServiceMenu]);

