import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {Track} from "./track.var";
import {pointsToXmlDoc, xml2string} from "../util/create-xml-doc";

export interface StravaD{
    Authorization: string
    activity_type: string
    data_type: string
}

@Injectable()
export class StravaService{
    
    
    private socket: any;
    public docsFor: Array<Track>;
    
    constructor(private  io: Io){
        this.socket = io.socket;
        this.docsFor = [];
    }
    
    addToExport(track: Track){
        this.docsFor.push(track)
    }

    sendTrackToStrava(track: Track, authorization : string){
        return pointsToXmlDoc(track.points)
            .then(xmlDpc=>{
                const file = xml2string(xmlDpc)
                return this.socket.$emit('sendTrackToStrava', {
                     file, authorization
                })
                //console.log(xmlDpc)
            })

        
    }
}