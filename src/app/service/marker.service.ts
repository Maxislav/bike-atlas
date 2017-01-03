
import {Injectable} from "@angular/core";
import {MapService} from "./map.service";
import {Point} from "./track.var";

export interface Marker{
    id: string;
    setCenter: Function;
    hide: Function;
    update: Function;
    popup: any;
}


@Injectable()
export class MarkerService{
    private layerIds: Array<string>;

    constructor(private maps: MapService){
        this.layerIds = [];
    }


    marker(p: Point, name: string): Marker{
        let point = {
            "type": "Point",
            "coordinates": [p.lng, p.lat],
            "bearing": p.bearing;
        };
        const map = this.maps.map;
        let mapBearing = map.getBearing();
        const F = parseFloat;

        let layerId:string = this.getNewLayer(0, 5000000, true)+'';

        map.addSource(layerId, { type: 'geojson', data: point });

        map.addLayer({
            "id": layerId,
            "type": "symbol",
            "source": layerId,
            "layout": {
                "icon-image": "arrow",
                "icon-rotate": point.bearing
            }
        });
        const mapboxgl = this.maps.mapboxgl;

        //console.log()

        const popup = new mapboxgl.Popup({closeOnClick: false, offset: [0, -15], closeButton: false})
            .setLngLat(point.coordinates)
            .setHTML('<div>'+name+'</div>')
            .addTo(map);

        const marker: Marker = {
            id: layerId,
            popup: popup,
            setCenter: function (_point: Point) {
                point.coordinates = [_point.lng, _point.lat];
                if(_point.bearing){
                    map.setLayoutProperty(layerId, 'icon-rotate', _point.bearing-map.getBearing());
                }
                popup.setLngLat(point.coordinates);
                map.getSource(layerId).setData(point);
            },
            update: function () {
                map.setLayoutProperty(layerId, 'icon-rotate', point.bearing-map.getBearing());
                map.getSource(layerId).setData(point)
            },
            hide: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId);
                console.log('delete marker id', layerId);
                map.off('move', move);
            }
        }

        function move(){
            if(map.getBearing()!=mapBearing){
                marker.update();
                mapBearing = map.getBearing();
            }
        }

        map.on('move', move);

        return marker;
    }



    getNewLayer(min, max, int) {
        var rand = min + Math.random() * (max - min);
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
