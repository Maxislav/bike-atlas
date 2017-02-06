
import {Injectable} from "@angular/core";
import {Device} from "./device.service";
import {Io} from "./socket.oi.service";


export interface User{
    id: number;
    name: string;
    image: string;
    deviceKeys?:Array<string>;
    setting?: any;
    devices?: Array<Device>;
}


@Injectable()

export class UserService{
    

    private _user: User;
    private _friends: Array<User> = [];
    private _other: User;
    private socket: any;
    private images: {[userId:number]: String} ={};
    constructor(private io: Io){
        this.socket = io.socket;
        this._user = {
            name: null,
            id: null,
            image: null
        };
        this._other = {
            id: null,
            name: null,
            image: null,
            devices: []
        };
    }

    clearUser(){
       for (let opt in this._user){
           this._user[opt] = null
       }
    }
    clearAll(){
        this.user.devices.forEach(device=>{
            if(device.marker){
                device.marker.remove()
            }
        });
        this.friends.forEach(friend=>{
            friend.devices.forEach(device=>{
                if(device.marker){
                    device.marker.remove()
                }
            })
        });
        while (this.friends.length){
            this.friends.shift()
        }
        this.clearUser();
    }
    
    createDeviceOther(device){
        this._other.devices.push(device);
        return device
    }

    getUserImageById(id: number) {
        if(this.images[id]){
            return Promise.resolve(this.images[id])
        }else{
            return this.socket.$emit('getUserImage', id)
                .then(data=>{
                    this.images[data.id] = data.image;
                    return data.image;
                })
        }

    }

    get other():User {
        return this._other;
    }

    set other(value:User) {
        this._other = value;
    }
  

    set friends(friends: Array<User>){
        if(!friends) return;
        this._friends.length = 0;
        friends.forEach(friend=>{
            this._friends.push(friend)
        })
    }
    get friends(){
        return this._friends
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        for(let opt in value){
            this._user[opt] = value[opt]
        }
    }




}

