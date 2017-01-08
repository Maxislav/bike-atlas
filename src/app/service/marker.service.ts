
import {Injectable} from "@angular/core";
import {MapService} from "./map.service";
import {Point} from "./track.var";
import {DeviceData} from "./log.service";
import {TimerService} from "./timer.service";

export interface Marker{
    id: string;
    hide: Function;
    rotate: Function;
    update: Function;
    popup: any;
    updateMarker: Function,
    deviceData: DeviceData,
    timePassed: number,
    status: string | Object;
    elapsed: string;
    date: string
}




@Injectable()
export class MarkerService{
    private layerIds: Array<string>;

    constructor(private mapService: MapService, private timer: TimerService){
        this.layerIds = [];
    }


    marker(deviceData: DeviceData): Marker{
        let point = {
            "type": "Point",
            "coordinates": [deviceData.lng, deviceData.lat],
            "bearing": deviceData.azimuth
        };
        const map = this.mapService.map;
        let mapBearing = map.getBearing();
        const F = parseFloat;

        let layerId:string = this.getNewLayer(0, 5000000, true)+'';

        this.mapService.onLoad.then(()=>{
           /* map.addSource(layerId, { type: 'geojson', data: point });
            map.addLayer({
                "id": layerId,
                "type": "symbol",
                "source": layerId,
                "layout": {
                    "icon-image": getIconImage(deviceData),
                    "icon-rotate": point.bearing
                }
            });*/
        });

        const mapboxgl = this.mapService.mapboxgl;

        const icoContainer = document.createElement('div');
        icoContainer.classList.add("user-icon");

        icoContainer.setAttribute('status', getIconImage(deviceData));


        const img = new Image();
        img.src = deviceData.image || 'src/img/no-avatar.gif';
        icoContainer.appendChild(img);

        const popup = new mapboxgl.Popup({closeOnClick: false, offset: [0, -15], closeButton: false})
            .setLngLat(point.coordinates)
            .setHTML('<div>'+deviceData.name+'</div>')
            .addTo(map);

        const iconMarker = new mapboxgl.Marker(icoContainer, {offset:[-20,-20]})
            .setLngLat(point.coordinates)
            .addTo(map);


        let intervalUpdateMarker = null;

       const timer = this.timer;

        const marker: Marker = {
            id: layerId,
            popup: popup,
            deviceData: deviceData,
            timePassed: 0,
            elapsed: '...',
            status: getIconImage(deviceData),
            updateMarker: function(){
                this.status = getIconImage(this.deviceData);
                icoContainer.setAttribute('status', this.status);
                this.elapsed = timer.elapse(this.deviceData.date)
            },
            update: function (d: DeviceData) {
                for (let opt in d){
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
                map.setLayoutProperty(layerId, 'icon-rotate', point.bearing-map.getBearing());
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
        };

        function move(){
            if(map.getBearing()!=mapBearing){
                marker.rotate();
                mapBearing = map.getBearing();
            }
        }
        intervalUpdateMarker = setInterval(()=>{
            marker.updateMarker();
            //this.timer.elapse(this.deviceData.date)
        }, 1000)
        /*map.on('move', move);
        intervalUpdateMarker = setInterval(()=>{
            marker.updateMarker();
        }, 10000);*/

        return marker;
    }

    getNewLayer(min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand ='marker'+ Math.round(rand)
        }
        if (-1<this.layerIds.indexOf(rand)) {
            return this.getNewLayer(min, max, int)
        } else {
            return rand;
        }

    }
}

function getIconImage(device){

    let dateLong = new Date(device.date).getTime();
    let passed = new Date().getTime() - dateLong;
    if(passed<10*60*1000){
        if(device.speed<0.1){
            return 'green';
        }else{
            return 'arrow'
        }
    }else if(passed<3600*12*1000){
        return 'yellow'
    }else{
        return 'white'
    }

}