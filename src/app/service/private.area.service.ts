import {Injectable} from "@angular/core";
import {MapService} from "./map.service";

export  interface Area{
    lng: number;
    lat: number;
    id: number
    radius: number
}

@Injectable()
export class PrivateAreaService{
    public map : any;
    public areas: Array<Area>;
    public onLoadMap: any;
    private layerIds: Array<string>;


    constructor(private mapService: MapService){
        this.layerIds = [];
        this.onLoadMap =  mapService.onLoad;
        mapService.onLoad.then(_map=>{
            this.map = _map
        })
    }



    createArea([lng, lat]){

        const id = this.getNewLayerId();
        const radius = 0.5;
        this.map.addSource(id, createGeoJSONCircle([lng, lat], radius));

        this.map.addLayer({
            "id": id,
            "type": "fill",
            "source": id,
            "layout": {},
            "paint": {
                "fill-color": "blue",
                "fill-opacity": 0.6
            }
        });

        function createGeoJSONCircle(center, radiusInKm, points?:number) {
            if(!points) points = 64;

            const coords = {
                latitude: center[1],
                longitude: center[0]
            };

            const km = radiusInKm;

            const ret = [];
            let distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
            let distanceY = km/110.574;

            let theta, x, y;
            for(let i=0; i<points; i++) {
                theta = (i/points)*(2*Math.PI);
                x = distanceX*Math.cos(theta);
                y = distanceY*Math.sin(theta);

                ret.push([coords.longitude+x, coords.latitude+y]);
            }
            ret.push(ret[0]);

            return {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [ret]
                        }
                    }]
                }
            };
        };
        return {
            id: id,
            lng: lng,
            lat: lat
        }
    }

    getNewLayerId(): String {
        const min=0, max=10000;
        let rand = (min + Math.random() * (max - min));
        const  newId =('area'+ Math.round(rand)).toString();
        if (-1<this.layerIds.indexOf(newId)) {
            return this.getNewLayerId()
        } else {
            this.layerIds.push(newId);
            return newId;
        }

    }

}