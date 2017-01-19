"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MyImage = (function (_super) {
    __extends(MyImage, _super);
    function MyImage() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.apply(this, args);
    }
    MyImage.prototype.toCanvas = function (w, h, w1, h1, x, y) {
        var canvas = document.createElement('canvas');
        canvas.width = w ? w : this.width;
        canvas.height = h ? h : this.height;
        var ctx = canvas.getContext('2d');
        if (!w1 && !h1) {
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
        }
        else {
            ctx.drawImage(this, 0, 0, this.width, this.height, x || 0, y || 0, w1, h1);
        }
        //ctx.drawImage(this,0, 0, canvas.width, canvas.height, x || 0, y || 0, w1 || canvas.width , h1 || canvas.height);
        //ctx.drawImage(this,0, 0, canvas.width, canvas.height, x || 0, y || 0, w1 || canvas.width , h1 || canvas.height);
        return canvas;
    };
    return MyImage;
}(Image));
;
var images = {};
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    }
    else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    }
    else {
        xhr = null;
    }
    return xhr;
}
function loadPromise(url) {
    return new Promise(function (resolve, reject) {
        var xhr = createCORSRequest("GET", url);
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onerror = function (e) {
            reject(e);
        };
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
                var imgData = xhr.response;
                var img_1 = new Image();
                var blob = new window.Blob([new Uint8Array(imgData)], { type: 'image/png' });
                img_1.onload = function () {
                    (window.URL || window.webkitURL).revokeObjectURL(img_1.src);
                    resolve(img_1);
                };
                img_1.src = (window.URL || window.webkitURL).createObjectURL(blob);
            }
            else {
                reject(new Error(xhr.statusText));
            }
        };
        xhr.send();
    });
}
function _getImage(url, cache) {
    if (cache) {
        if (!images[url]) {
            images[url] = loadPromise(url);
        }
        return images[url];
    }
    else {
        return loadPromise(url);
    }
}
exports.getimage = _getImage;
//# sourceMappingURL=get-image.js.map