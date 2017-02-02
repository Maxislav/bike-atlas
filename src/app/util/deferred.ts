export class Deferred{
    promise: Promise<any>;
    _resolve: Function;
    _reject: Function;
    status: number;
    constructor(){
        this.status = 0;
        this.promise = new Promise((resolve, reject)=>{
            this._resolve = resolve;
            this._reject = reject;
        })

    }
    resolve(value){

        this._resolve(value);
        this.status = 1;
    }
    reject(value){
        this.status = 2;
        this._reject(value)
    }

}
