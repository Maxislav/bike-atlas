import {Component, Input, OnInit} from "@angular/core";
import {  Subscription } from 'rxjs';
import { Device } from 'src/app/service/device.service';
import { TimerService } from 'src/app/service/timer.service';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'menu-athlete-item',
    templateUrl: './menu.athlete.item.component.html',
    styleUrls: ['./menu.athlete.item.component.less'],
})
export class MenuAthleteItemComponent implements OnInit{
    subscription: Subscription;
    @Input() public device: Device;
    constructor(private timerService: TimerService){
    }

    ngOnInit(): void {
    }

    get speed(){
        return this.device.speed.toFixed(1)
    }

    get elapsed(){
        return this.timerService.elapse(this.device.date.toISOString())
    }

    get image(){
        return this.device.image || `${environment.hostPrefix}img/speedway_4_logo.jpg`;
    }




}
