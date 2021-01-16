import {Injectable} from '@angular/core';
import {ComponentStore} from '@ngrx/component-store';

export enum COLOR {
    RED = '#f00',
    GREEN = '#04e200'
}

export interface BattLevelState {
    level: number,
    color: COLOR,
    text: string,
    visible: boolean,
}

const initialBatLevelState: BattLevelState = {
    level: 0,
    color: COLOR.RED,
    text: '',
    visible: false
};

@Injectable()
export class BattLevelStore extends ComponentStore<BattLevelState> {
    constructor() {
        super(initialBatLevelState);
    }

    readonly setLevel = this.updater<number>((state, level) => {
        return {
            ...state,
            level,
            color: 15 < level ? COLOR.GREEN : COLOR.RED,
            visible: 0 < level
        }
    })
}
