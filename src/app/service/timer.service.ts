import {Injectable} from "@angular/core";

export class Timer{
    public date: Date;

    constructor(date?: string | Date){
        this.date = new Date(date)
    }
    tick(date?: string | Date): number {
        const prevDate = this.date;
        this.date = new Date(date);
        return this.date.getTime() - prevDate.getTime()
    }
}


@Injectable()
export class TimerService {

    constructor() {
    }

    elapse(d: string): string {

        let timeDiff = new Date().getTime() - new Date(d).getTime();

// strip the ms
        timeDiff /= 1000;

// get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
        const seconds = Math.round(timeDiff % 60);

// remove seconds from the date
        timeDiff = Math.floor(timeDiff / 60);

// get minutes
        const minutes = Math.round(timeDiff % 60);

// remove minutes from the date
        timeDiff = Math.floor(timeDiff / 60);

// get hours
        const hours = Math.round(timeDiff % 24);

// remove hours from the date
        timeDiff = Math.floor(timeDiff / 24);

// the rest of timeDiff is number of days
        const days = timeDiff;

        let result = '';

            if (0<days) {
                result += days + 'д ';
            }
            if(0<hours){
                result+= hours + "ч "
            }
            if(0<minutes){
                result+=minutes + 'min '
            }
            result+=seconds + "s";


        return result
    }
}
;
