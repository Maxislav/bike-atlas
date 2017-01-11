import {Injectable} from "@angular/core";
import {MapService} from "./map.service";
import {Point} from "./track.var";
import {DeviceData} from "./log.service";
import {TimerService} from "./timer.service";

export interface Marker {
    id:string;
    image: string;
    lng: number;
    lat: number;
    name: string;
    popup:any;
    azimuth: number;
    status:string;
    elapsed:string;
    speed: number;
    date: string;
    updateMarker:Function;
    deviceData:DeviceData;
    
    hide:Function;
    rotate:Function;
    update:Function;
    remove: Function;
    
}


@Injectable()
export class MarkerService {
    private layerIds:Array<string>;

    constructor(private mapService:MapService, private timer:TimerService) {
        this.layerIds = [];
    }


    marker(marker2:Marker):Marker {
     
        const map = this.mapService.map;
        const layerId:string = this.getNewLayer(0, 5000000, true) + '';
        const mapboxgl = this.mapService.mapboxgl;
        let mapBearing = map.getBearing();
        
        const icoContainer = document.createElement('div');
        icoContainer.classList.add("user-icon");

        icoContainer.setAttribute('status', getIconImage(marker2));


        const img = new Image();
        img.src = marker2.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);

        const popup = new mapboxgl.Popup({closeOnClick: false, offset: [0, -15], closeButton: false})
            .setLngLat([marker2.lng, marker2.lat])
            .setHTML('<div>' + marker2.name + '</div>')
            .addTo(map);

        const iconMarker = new mapboxgl.Marker(icoContainer, {offset: [-20, -20]})
            .setLngLat([marker2.lng, marker2.lat])
            .addTo(map);


        let intervalUpdateMarker = null;

        const timer = this.timer;

        /*const marker:Marker = {
            id: layerId,
            popup: popup,
            deviceData: marker2,
            elapsed: '...',
            status: getIconImage(marker2),
            updateMarker: function () {
                this.status = getIconImage(this.deviceData);
                icoContainer.setAttribute('status', this.status);
                this.elapsed = timer.elapse(this.deviceData.date)
            },
            update: function (d:DeviceData) {
                for (let opt in d) {
                    this.deviceData[opt] = d[opt]
                }
                point.coordinates = [d.lng, d.lat];
                popup.setLngLat(point.coordinates);
                iconMarker.setLngLat(point.coordinates);
                this.status = getIconImage(this.deviceData);
                icoContainer.setAttribute('status', this.status);

                //map.getSource(layerId).setData(point);
            },
            rotate: function () {
                map.setLayoutProperty(layerId, 'icon-rotate', point.bearing - map.getBearing());
                map.getSource(layerId).setData(point)
            },
            hide: function () {
                //map.removeLayer(layerId);
                //map.removeSource(layerId);
                popup.remove();
                console.log('delete marker id', layerId);
                iconMarker.remove();
                intervalUpdateMarker && clearInterval(intervalUpdateMarker);
            }
        };*/

        /*function move() {
            if (map.getBearing() != mapBearing) {
                marker.rotate();
                mapBearing = map.getBearing();
            }
        }*/
        
        
        marker2.update = function (d:DeviceData) {
            for (let opt in d) {
                this.marker2[opt] = d[opt]
            }
            popup.setLngLat([this.lng, this.lat]);
            iconMarker.setLngLat([this.lng, this.lat]);
            this.status = getIconImage(this);
            icoContainer.setAttribute('status', this.status);
        };
        
        marker2.updateMarker = function () {
            this.status = getIconImage(this);
            icoContainer.setAttribute('status', this.status);
            this.elapsed = timer.elapse(this.date)
        };

        marker2.remove = function () {
            popup.remove();
            console.log('delete marker id', layerId);
            iconMarker.remove();
            intervalUpdateMarker && clearInterval(intervalUpdateMarker);
        };

        intervalUpdateMarker = setInterval(()=> {
            marker2.updateMarker();
        }, 1000);
        

        return marker2;
    }

    getNewLayer(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = 'marker' + Math.round(rand)
        }
        if (-1 < this.layerIds.indexOf(rand)) {
            return this.getNewLayer(min, max, int)
        } else {
            return rand;
        }

    }
}

function getIconImage(device) {

    let dateLong = new Date(device.date).getTime();
    let passed = new Date().getTime() - dateLong;
    if (passed < 10 * 60 * 1000) {
        if (device.speed < 0.1) {
            return 'green';
        } else {
            return 'arrow'
        }
    } else if (passed < 3600 * 12 * 1000) {
        return 'yellow'
    } else {
        return 'white'
    }

}