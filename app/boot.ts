import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {MymapEvents} from "./services/service.map.events";

bootstrap(AppComponent, [ MymapEvents]);