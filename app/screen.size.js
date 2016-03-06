System.register([], function(exports_1) {
    var ScreenSize;
    return {
        setters:[],
        execute: function() {
            /**
             * Created by maxim on 2/28/16.
             */
            ScreenSize = (function () {
                function ScreenSize() {
                    this.width = 0;
                    this.height = 0;
                    var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
                    this.width = x;
                    this.height = y;
                }
                return ScreenSize;
            })();
            exports_1("ScreenSize", ScreenSize);
        }
    }
});
//# sourceMappingURL=screen.size.js.map