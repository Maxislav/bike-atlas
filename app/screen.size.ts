/**
 * Created by maxim on 2/28/16.
 */
export class ScreenSize{
    constructor(){
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        alert(x + ' × ' + y);
    }
    public width(){

    }
}

