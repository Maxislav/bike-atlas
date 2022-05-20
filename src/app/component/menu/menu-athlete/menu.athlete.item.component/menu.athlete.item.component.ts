import {Component, HostListener, Input, OnDestroy, OnInit} from "@angular/core";
import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {Device, DeviceService} from 'src/app/service/device.service';
import {TimerService} from 'src/app/service/timer.service';
import {environment} from 'src/environments/environment';
import {debounceTime, filter, takeUntil, tap} from 'rxjs/operators';
import {ToastService} from '../../../../shared-module/toast-module/toast.service';

@Component({
    selector: 'menu-athlete-item',
    templateUrl: './menu.athlete.item.component.html',
    styleUrls: ['./menu.athlete.item.component.less'],
})
export class MenuAthleteItemComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    mouseEnterLive$ = new ReplaySubject<boolean>(1)

    onDestroy$ = new Subject()

    @Input() public device: Device;

    isVisible = false;
    // subscription: Subscription

    @HostListener('document:click')
    outsideClick() {
        this.isVisible = false
    }

    constructor(
        private timerService: TimerService,
        private deviceService: DeviceService,
        private toast: ToastService,
    ) {
    }

    ngOnInit(): void {
       this.mouseEnterLive$
            .pipe(
                takeUntil(this.onDestroy$),
                tap((v) => {
                    if (v) {
                        this.isVisible = true
                    }
                }),
                debounceTime(5000),
                filter(v => !v)
            )
            .subscribe(() => {
                this.isVisible = false
            })

    }

    showButton(e: Event){
        e.stopPropagation()
        this.mouseEnterLive$.next(true)
        this.mouseEnterLive$.next(false)
    }
    onRequestLocation(e) {
        e.stopPropagation()
        this.isVisible = false
        this.deviceService.onLocationUpdate(this.device)
            .then(d => {
                if(d.success){
                    this.toast.show({
                        type: 'success',
                        text: 'Location request has been sent'
                    });
                }else if(d.error?.message){
                    this.toast.show({
                        type: 'warning',
                        text: d.error?.message
                    });
                }
                console.log(d)
            })
    }

    onMouseOver() {
        this.mouseEnterLive$.next(true)
    }

    onMouseLeave() {
        this.mouseEnterLive$.next(false)
    }

    get batt(): number {
        return this.device.marker?.batt
    }

    get speed() {
        return this.device.speed.toFixed(1)
    }

    get elapsed() {
        return this.timerService.elapse(this.device.date.toISOString())
    }

    get image() {
        return this.device.image || `${environment.hostPrefix}img/speedway_4_logo.jpg`;
    }

    ngOnDestroy(): void {
        this.onDestroy$.next(void 0)
        this.onDestroy$.complete()
    }


}
