import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {DeviceService} from '../../../service/device.service';
import {SelfUnsubscribable} from '../../../util/self-unsubscribable';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: './device-help.component.html',
    styleUrls: [
        './device-help.component.less'
    ]
})
export class DeviceHelpComponent extends SelfUnsubscribable implements OnInit, OnDestroy {

    public deviceName: string;
    public hostPrefix = environment.hostPrefix;

    constructor(private route: ActivatedRoute, private deviceService: DeviceService) {
        super()
        this.route.params
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((data: { device: string }) => {
                this.deviceName = data.device;
                deviceService.setCurrentChildName(data.device)

            })

    }

    ngOnInit(): void {

        //debugger;

    }

    ngOnDestroy(): void {
        this.deviceService.setCurrentChildName(null);
    }
}
