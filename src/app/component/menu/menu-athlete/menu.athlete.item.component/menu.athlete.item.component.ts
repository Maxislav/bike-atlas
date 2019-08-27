import {Component, Input, OnInit} from "@angular/core";
import {  Subscription } from 'rxjs/Subscription';
import {Device} from '../../../../../types/global';
@Component({
    selector: 'menu-athlete-item',
    templateUrl: './menu.athlete.item.component.html',
    styleUrls: ['./menu.athlete.item.component.less'],
})
export class MenuAthleteItemComponent implements OnInit{
    speed: string;
    subscription: Subscription;
    @Input() public device: Device;
    constructor(){
    }

    ngOnChanges(){
        if(this.subscription && this.device.marker) {
            this.subscription.unsubscribe()
        }
        if(this.device.marker){
            this.subscription = this.device.marker.speedSubject.subscribe(value => {
                this.speed = value.toFixed(1)
            })
        }
    }

    ngOnInit(): void {


    }
    ngOnDestroy(){
        if(this.subscription) this.subscription.unsubscribe()
    }

}