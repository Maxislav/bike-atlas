import {Injectable} from "@angular/core";


const jsonParse = (str) :{}=>{
    let json;
    try {
        json = JSON.parse(str)
    }catch (err){
        console.warn('Error parse json from localStorage')
    }
    return json || {};
};



class Storage {

    static prefix= 'ba';
    private  storageKey: string;

    constructor(name) {
        this.storageKey = Storage.prefix +'-'+ name
    }

    setItem(name:string, value: any): any {
        const json = this.json;
        json[name] = value;
        window.localStorage.setItem(this.storageKey, JSON.stringify(json));
       // this._doChange && this._doChange(json);
       // this.emit(name, value);
        return value
    }
    /**
     * @param {string} name
     * @return {number|string}
     */
    getItem (name){
        return this.json[name]
    }
    removeItem(name) {
        const json = this.json ;
        delete  json[name];
        window.localStorage.setItem(this.storageKey, JSON.stringify(json));
    }

    get json(){
        return jsonParse(window.localStorage.getItem(this.storageKey))
    }


}


@Injectable()
export class LocalStorageBa{

    private storages : {[id:string]:Storage} = {};
    constructor(){

    }

    create(name: string){
        const storages = this.storages;
        if (storages[name]){
            return storages[name]
        }

        return storages[name] = new Storage(name)
    }

}
