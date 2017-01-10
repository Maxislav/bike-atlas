import {Injectable} from "@angular/core";
import {MapService} from "./map.service";

export  interface Area{
    lng: number;
    lat: number;
    id: string;
    radius: number;
    update: Function;
    remove: Function;
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



    createArea([lng, lat], r?: number): Area{

        const layerId = this.getNewLayerId();
        const radius = r || 0.5;
        const map = this.map;

        this.map.addSource(layerId,
            {
                type: "geojson",
                data:  createGeoJSONCircle([lng, lat], radius)
            });

        this.map.addLayer({
            "id": layerId,
            "type": "fill",
            "source": layerId,
            "layout": {},
            "paint": {
                "fill-color": "red",
                "fill-opacity": 0.3
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

            return  {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [ret]
                        }
                    }]
            };
        };

        return {
            id: layerId,
            lng: lng,
            lat: lat,
            radius:radius,
            update: function ([lng, lat], r?: number) {
                this.lng = lng;
                this.lat = lat;
                map.getSource(layerId)
                    .setData(createGeoJSONCircle([lng, lat], r))
            },
            remove: function () {
                map.removeLayer(layerId);
                map.removeSource(layerId)
            }
        }
    }

    getNewLayerId(): string {
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