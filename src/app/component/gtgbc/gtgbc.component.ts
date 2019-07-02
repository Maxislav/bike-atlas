import { Component, OnInit } from '@angular/core';
import { ngIfAnimation } from '../../animation/animation';
import { MapService } from '../../service/map.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GtgbcService } from '../../api/gtgbc.service';
import { MobileCell } from '../../../@types/global';
import { TrackService } from 'src/app/service/track.service';

@Component({
    moduleId: module.id,
    templateUrl: './gtgbc.component.html',
    styleUrls: ['./gtgbc.component.css'],
    animations: [ngIfAnimation]
})
export class GtgbcComponent implements OnInit {
    public gtgbc: string = null;
    private mcArr;
    private static layerIds:Array<String> = [];

    //public gtgbcViewModel: string = null;

    constructor(
        private mapService: MapService,
        private router: Router,
        private route: ActivatedRoute,
        private gtgbcService: GtgbcService
    ) {


    }

    onClose() {
        this.router.navigate(['/auth', 'map']);
    }

    ngOnInit(): void {
        this.route.params
            .subscribe(params => {
                this.gtgbc = params['gtgbc'];
                const arr: Array<MobileCell> = this.convertToMobileCell();
                console.log('param: -> ', this.gtgbc);
                this.gtgbcService.getLatLng(arr)
                    .then(pointsList=>{
                        this.drawPoints(pointsList)
                    })
                    .catch(e=>{
                        console.error(e)
                    })

            });
    }


    private drawPoints(pointsList: Array<{lng:number, lat: number}>){
        console.log(pointsList)
        const layerId = this.getLayerId('mobile-cell-');

            this.mapService.onLoad
                .then(map => {
                    map.addSource(layerId, {
                        type: "geojson",
                        data: sourceData
                    });
                    map.addLayer({
                        id: layerId,
                        type: "circle",
                        "paint": {
                            "circle-color": {
                                "property": "color",
                                "stops": [['#ff0000', '#ff0000']],
                                "type": "categorical"
                            },
                            "circle-radius": 8
                        },
                        layout: {},
                        source: layerId
                    });
                });

        const sourceData = this.getData(pointsList);
    }

    getData(pointsList){
        return {
            "type": "FeatureCollection",
            "features": (()=> {
                const features = [];
                pointsList.forEach((item, i)=> {
                    const f = {
                        properties: {
                            color: '#ff0000',
                            point: item,
                            id: item.id,
                        },
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [item.lng, item.lat]
                        }
                    };
                    features.push(f)
                });
                return features
            })()
        };
    }

    //+RESP:GTLBS,440503,866427030059602,GL520,0,0,100,0,2,,,0000,0255,0001,0715,487d,30,,0255,0001,0715,1402,23,,0255,0001,0715,487b,22,,0255,0001,0715,4fa7,13,,025$
    get gtgbcViewModel(): string {
        if (!this.gtgbc) {
            return null;
        }
        return this.transformToView();
    }

    gtgbcOnChange(){

    }

    onApplyClick(){
        this.router.navigate(['/auth', 'map', 'gtgbc', this.gtgbc]);
    }

    private convertToMobileCell(): Array<MobileCell>{
        const mc = {
            mcc: null,
            mnc: null,
            lac: null,
            cellId: null
        };
       const arr = this.gtgbc.split(',')
        arr.splice(0,12);
        const res = [];

        while (arr.length){
            res.push(arr.splice(0,6))
        }



        return res.filter(item=>6<=item.length ).map(item => {
            return {
                mcc: parseInt(item[0], 10),
                mnc: parseInt(item[1], 10),
                lac:  parseInt(item[2], 16),
                cellId:  parseInt(item[3], 16)
            }
        })
    }

    private transformToView(): string {
        const arr = this.gtgbc ? this.gtgbc.split(',') : [];
        return this.cut(arr);
    }

    private cut(charArr: Array<string>, i: number = 1, str: string = ''): string{
        if(charArr.length  ){
            let _str =  charArr.slice(0,i).join(',');
            if(_str.length < 60 && i <charArr.length){
                return this.cut(charArr, ++i, str)
            }else {
                charArr.splice(0,i);
                str = str.concat(str.length ? ', '+_str: _str);
                if(charArr.length){
                    return this.cut(charArr , 1, str)
                }else{
                    return str
                }
            }
        }
        return str;
    }

    private getLayerId(prefix?:String) {
        prefix = prefix || '';
        const min = 0, max = 10000;

        const rand = prefix + Math.round(min + Math.random() * (max - min)).toLocaleString();

        if (-1 < GtgbcComponent.layerIds.indexOf(rand)) {
            return this.getLayerId(prefix)
        } else {
            GtgbcComponent.layerIds.push(rand);
            return rand;
        }
    }
}
