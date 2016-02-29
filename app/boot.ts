import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {LatLngService} from './services/service.lat.lng'

bootstrap(AppComponent, [LatLngService]);