'use strict';
importScripts('http://178.62.44.54/dist/app/util/get-color.js', 'http://178.62.44.54/node_modules/ramda/dist/ramda.min.js');
onmessage = (e) => {
    //console.log(e.data[0])
    const points = e.data[0];
    const result = R.sortBy(R.prop('speed'))(points);
    const max = result[result.length - 1].speed;
    points.forEach(point => {
        point.color = getHexColor(point.speed, max);
    });
    const colors = R.uniq(R.pluck('color')(points));
    const resColors = [];
    colors.forEach(item => {
        resColors.push([item, item]);
    });
    postMessage([points, resColors]);
    close();
};
//# sourceMappingURL=color-speed.js.map