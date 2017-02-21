import {Injectable} from "@angular/core";
import {Io} from "./socket.oi.service";
import {Track} from "./track.var";
import {pointsToXmlDoc, xml2string} from "../util/create-xml-doc";

export interface StravaD {
    Authorization: string
    activity_type: string
    data_type: string
}

export interface Athlete {
    firstName: string
    lastName: string
    profile: string
    city: string
    authorization: string
}

@Injectable()
export class StravaService {

    private stravaClientId: number = null;
    private stravaClientSecret: string = null;
    private socket: any;
    public docsFor: Array<Track>;
    public athlete: Athlete;

    constructor(private  io: Io) {
        this.socket = io.socket;
        this.docsFor = [];
    }

    addToExport(track: Track) {
        this.docsFor.push(track)
    }

    sendTrackToStrava(track: Track, authorization: string) {
        return pointsToXmlDoc(track.points)
            .then(xmlDpc => {
                const file = xml2string(xmlDpc)
                return this.socket.$emit('sendTrackToStrava', {
                    file, authorization
                });
                //console.log(xmlDpc)
            })


    }

    removeTrack(track: Track) {
        if (-1 < this.docsFor.indexOf(track)) {
            this.docsFor.splice(this.docsFor.indexOf(track), 1)
        }
    }

    getStrava() {

        if (this.stravaClientId && this.stravaClientSecret) {
            return Promise.resolve({
                stravaClientId: this.stravaClientId,
                stravaClientSecret: this.stravaClientSecret
            })
        } else {
            return this.socket.$emit('getStrava')
                .then(d => {
                    if (d && d.result == 'ok' && d.data) {
                        this.stravaClientId = d.data.stravaClientId;
                        this.stravaClientSecret = d.data.stravaClientSecret;
                        return {
                            stravaClientId: this.stravaClientId,
                            stravaClientSecret: this.stravaClientSecret
                        }
                    } else {
                        return Promise.reject('no auth')
                    }
                })
        }


    }

    isAuthorize() {
        if(this.athlete){
            return Promise.resolve(this.athlete)
        }else{
            return this.socket.$emit('isAuthorizeStrava')
                .then(d => {
                    console.log(d)
                    if (d.result && d.result == 'ok') {
                        const athlete = d.data.athlete;
                        this.athlete = {
                            firstName: athlete.firstname,
                            lastName: athlete.lastname,
                            profile: athlete.profile,
                            city: athlete.city,
                            authorization: d.data.token_type + " " + d.data.access_token
                        };
                        return this.athlete
                    }else {
                        return Promise.reject(false)
                    }
                })
        }
    }
    onDeauthorize(){
        return this.socket.$emit('onDeauthorizeStrava', this.athlete.authorization)
            .then(d=>{
                if(d && d.result =='ok'){
                    this.athlete = undefined
                }
                return d;
            })
    }

}