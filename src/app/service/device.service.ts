import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {LocalStorage} from "./local-storage.service";
import {Marker} from "./marker.service";
import {FriendsService} from "./friends.service";
import {UserService} from "./main.user.service";

export interface Device {
    id: string;
    name: string;
    image: string;
    ownerId: number,
    phone?: string,
    marker?: Marker;
    passed?: string;
    device_key?: string;
}


@Injectable()
export class DeviceService {

    private _devices: Array<Device>;
    private socket: any;

    constructor(private io: Io,
                private ls: LocalStorage,
                private user: UserService,
                private friend: FriendsService

    ) {
        this.socket = io.socket;
        this._devices = [];
    }

    updateDevices() {
       return this.socket.$emit('getDevice')
            .then(d => {
                if (d && d.result == 'ok') {
                    this.devices = d.devices
                }
                console.log(d);
                return this.devices
            })
            .catch(err => {
                console.log(err)
            })
    }

    onAddDevice(device: Device) {
        return new Promise((resolve, reject) => {
            this.socket.$emit('onAddDevice', device)
                .then(d => {
                    if (d && d.result == 'ok') {
                        this.updateDevices();
                        resolve(d)
                    }
                    reject()
                })
        })
    }
    onDelDevice(device: Device){
       return this.socket.$emit('onDelDevice', device)
           .then(d=>{
               if(d.result=='ok'){
                   let index = this.devices.indexOf(device)
                   if(-1<index){
                       this._devices.splice(index,1)
                   }
               }
               return d;
           })
    }
    clearDevice(){
        this._devices.length = 0;
    }

    get devices(): Array<Device> {
        return this._devices;
    }

    set devices(devices: Array<Device>) {
        this._devices.length = 0;
        devices.forEach(device => {
            if(device.ownerId == this.user.user.id){
                device.image = this.user.user.image
            }else{
                const friend = this.friend.friends.find((item)=>{
                    return device.ownerId == item.id
                });
                if(friend){
                    device.image = friend.image
                }
            }
            this._devices.push(device)
        });
    }

}
