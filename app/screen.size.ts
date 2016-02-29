/**
 * Created by maxim on 2/28/16.
 */
export class ScreenSize{
    public  width: number = 0;
    public  height: number = 0;
    constructor(){
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        this.width = x;
        this.height = y;
    }
}

