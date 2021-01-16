import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {BattLevelStore} from './batt-level.store';
import {map} from 'rxjs/operators';

@Component({
    selector: 'ats-batt-level',
    templateUrl: './batt-level.component.html',
    styleUrls: ['./batt-level.component.less'],
    providers: [BattLevelStore]
})
export class BattLevelComponent implements OnInit {
    @Input() set level(val) {
        this.battLevelStore.setLevel(val)
    }
    @HostBinding('class.ats-batt-level') cssClass = true;

    visible$ = this.battLevelStore.select((state) => state.visible);
    text$ = this.battLevelStore.select((state) => `${state.level}%`);

    styleWidth$ = this.battLevelStore.select((state) => `${state.level}%`);
    styleColor$ = this.battLevelStore.select((state) => state.color);

    constructor(public battLevelStore: BattLevelStore) {
    }

    ngOnInit(): void {
    }

}
