"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointsToXmlDoc = (points) => {
    return new Promise((resolve, reject) => {
        const parser = new DOMParser();
        const xmlDoc = document.createElement('gpx');
        xmlDoc.setAttribute('xmlns', "http://www.topografix.com/GPX/1/0");
        xmlDoc.setAttribute('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance");
        xmlDoc.setAttribute('version', "1.0");
        xmlDoc.setAttribute('creator', "Bike-Atlas");
        const time = document.createElement('time');
        time.innerText = new Date().toISOString();
        xmlDoc.appendChild(time);
        const trk = document.createElement('trk');
        xmlDoc.appendChild(trk);
        const trkseg = document.createElement('trkseg');
        trk.appendChild(trkseg);
        points.forEach((point) => {
            const trkpt = document.createElement('trkpt');
            trkpt.setAttribute('lat', point.lat.toString());
            trkpt.setAttribute('lon', point.lng.toString());
            const time = document.createElement('time');
            time.innerText = new Date(point.date).toISOString();
            trkpt.appendChild(time);
            const speed = document.createElement('speed');
            speed.innerText = point.speed.toString();
            trkpt.appendChild(speed);
            trkseg.appendChild(trkpt);
        });
        resolve(xmlDoc);
    });
};
exports.xml2string = (node) => {
    if (typeof (XMLSerializer) !== 'undefined') {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    }
    else if (node.xml) {
        return node.xml;
    }
};
//# sourceMappingURL=create-xml-doc.js.map