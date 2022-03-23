import {Component, Input} from '@angular/core';
import {Mercator} from './service/mercator.service'
import {MapService} from "./service/map.service";
import {InfoPositionComponent} from "./component/info-position/info-position-component";
import {MapboxGlDirective, MapResolver} from "./directive/mapbox-gl.directive";
import {LogService} from "./service/log.service";
import {APP_INITIALIZER} from '@angular/core';
import {ActivatedRoute, Resolve} from "@angular/router";
import {fadeInAnimation} from './animation/animation'
import {SelfUnsubscribable} from './util/self-unsubscribable';
import {takeUntil} from 'rxjs/operators';

@Component({
    //moduleId: module.id,
    template:
        '<info-position>' +
        '</info-position>' +
        '<router-outlet></router-outlet>' +
        '<mapbox-gl> map loading...</mapbox-gl>'
    ,
    styleUrls: ['./css/map.component.less'],
    providers: [],
    animations: [fadeInAnimation],
    host: {'[@fadeInAnimation]': ''}
})
export class MapComponent extends SelfUnsubscribable {


    constructor(private route: ActivatedRoute) {
        super()
        route.queryParams.pipe(takeUntil(this.onDestroy$))
            .subscribe((params) => {
                console.log(params)
            })
    }


}
