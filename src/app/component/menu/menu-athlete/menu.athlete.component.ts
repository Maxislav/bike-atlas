import { Component, EventEmitter, Output } from '@angular/core';
import { Device, DeviceService } from '../../../service/device.service';
import { MapService } from '../../../service/map.service';
import { UserService } from '../../../service/main.user.service';
import {autobind} from '../../../util/autobind';


@Component({
    selector: 'menu-athlete',
    templateUrl: './menu.athlete.component.html',
    styleUrls: ['./menu.athlete.component.less'],
})
export class MenuAthleteComponent {
    public userDevices: Array<Device>;
    public otherDevices: Array<Device>;


    @Output() onCloseMenuAthlete: EventEmitter<boolean> = new EventEmitter();

    constructor(private user: UserService, private mapService: MapService, private deviceService: DeviceService) {
        this.userDevices = deviceService.getDeviceList();
        this.otherDevices = [];
        // this.onCloseMenu = this.onCloseMenu.bind(this, false);

    }

    @autobind()
    onCloseMenu() {

        this.onCloseMenuAthlete.emit(false);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        setTimeout(() => {
            document.addEventListener('click', this.onCloseMenu);
        }, 10);
    }

    selectDevice(device) {
        if (device.marker) {
            this.mapService.map.flyTo({
                center: [device.marker.lng, device.marker.lat]
            });
        }
    }

    get friendDevices(): Array<Device> {
        const devices = [];
        /*   this.user.friends.forEach(friend=>{
              friend.devices.forEach(dev=>{
                  devices.push(dev)
              })
           });*/
        return devices;
    }

    ngOnDestroy() {
        document.removeEventListener('click', this.onCloseMenu);
    }
}
