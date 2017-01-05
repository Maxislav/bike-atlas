
import {Injectable} from "@angular/core";
import {MapService} from "./map.service";
import {Point} from "./track.var";
import {DeviceData} from "./log.service";

export interface Marker{
    id: string;
    setCenter: Function;
    hide: Function;
    rotate: Function;
    update: Function;
    popup: any;
    updateMarker: Function,
    deviceData: DeviceData
}


@Injectable()
export class MarkerService{
    private layerIds: Array<string>;

    constructor(private mapService: MapService){
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
            map.addSource(layerId, { type: 'geojson', data: point });
            map.addLayer({
                "id": layerId,
                "type": "symbol",
                "source": layerId,
                "layout": {
                    "icon-image": getIconImage(deviceData),
                    "icon-rotate": point.bearing
                }
            });
        });

        const mapboxgl = this.mapService.mapboxgl;


        const popup = new mapboxgl.Popup({closeOnClick: false, offset: [0, -15], closeButton: false})
            .setLngLat(point.coordinates)
            .setHTML('<div>'+deviceData.name+'</div>')
            .addTo(map);


        let timer = null;

        const marker: Marker = {
            id: layerId,
            popup: popup,
            deviceData: deviceData,
            setCenter: function (d: DeviceData) {

            },
            updateMarker: function(){
                map.setLayoutProperty(layerId, 'icon-image', getIconImage(this.deviceData));
            },
            update: function (d: DeviceData) {
                this.deviceData = d;
                point.coordinates = [d.lng, d.lat];
                if(d.azimuth){
                    map.setLayoutProperty(layerId, 'icon-rotate', d.azimuth-map.getBearing());
                }
                this.updateMarker(d);
                popup.setLngLat(point.coordinates);
                map.getSource(layerId).setData(point);
            },
            rotate: function () {
                map.setLayoutProperty(layerId, 'icon-rotate', point.bearing-map.getBearing());
                map.getSource(layerId).setData(point)
            },
            hide: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                console.log('delete marker id', layerId);
                map.off('move', move);
                timer && clearInterval(timer);
            }
        };

        function move(){
            if(map.getBearing()!=mapBearing){
                marker.rotate();
                mapBearing = map.getBearing();
            }
        }

        map.on('move', move);

        timer = setInterval(()=>{
            marker.updateMarker();
        }, 10000);

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