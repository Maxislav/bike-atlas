export  interface MapArea{
    id?: number;
    lng: number;
    lat: number;
    layerId?: string,
    radius: number;
    update?: Function;
    remove?: Function;
}
