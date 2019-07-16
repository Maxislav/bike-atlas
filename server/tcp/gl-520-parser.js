const {Deferred} = require ('../deferred.js');

const MessageType = {
    GTSTR: 0,
    GTLBS: 1,
    GTGSM: 2,
    toString(n){
        const r =  {
            0: 'GTSTR',
            1: 'GTLBS',
            2: 'GTGSM'
        };
        return r[n]
    }
};


class Gl520Parser {
    constructor() {
        /**
         * @private
         * @type {String}
         */
        this.srcMsg = null;
        /**
         * @private
         * @type {String}
         */
        this.type = null;

        /**
         * @type {number}
         */
        this.messageType = -1;

        this._data = null;

        /**
         * @type {Deferred|*}
         */
        this._deferred = new Deferred();

    }

    /**
     *
     * @param {string} srcStr
     * @returns {Gl520Parser}
     */
    setSrcData(srcStr) {
        this.srcMsg = srcStr;
        this._setType(srcStr);
        this._parseData();
        return this;
    }

    /**
     * @returns {Promise|Promise<any>}
     */
    getData() {
        return this._deferred.promise;
    }

    /**
     *
     * @returns {*}
     * @private
     */
    _parseData() {

        const respData = {
            alt: null,
            lng: null,
            lat: null,
            azimuth: null,
            speed: null,
            date: null,
            src: this.srcMsg
        };

        if (this.messageType === MessageType.GTSTR) {
            const arr = this.srcMsg.split(',');
            /**
             * @type {string}
             */
            const srcDate = arr[15];
            this._data = Object.assign(respData, {
                device_key: arr[2],
                id: arr[2],
                speed: arr[10],
                azimuth: arr[11],
                alt: arr[12],
                lng: arr[13],
                lat: arr[14],
                type: this.type,
                date: new Date(Number(srcDate.slice(0, 4)),
                    Number(srcDate.slice(4, 6)) - 1,
                    Number(srcDate.slice(6, 8)),
                    Number(srcDate.slice(8, 10)),
                    Number(srcDate.slice(10, 12)),
                    Number(srcDate.slice(12, 14)))
            });

            this._deferred.resolve(this._data)
        } else {
            this._deferred.resolve(null)
        }

    }

    _setType(str) {
        switch (true) {
            case !str: {
                this.messageType = -1;
                break;
            }
            case typeof str !== 'string': {
                this.messageType = -1;
                break;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTSTR,\d+,\d+,.+/): {
                this.messageType = MessageType.GTSTR;
                break;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTLBS,\d+,\d+,.+/): {
                this.messageType = MessageType.GTLBS;
                break;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTGSM,\d+,\d+,.+/): {
                this.messageType = MessageType.GTGSM;
                break;
            }
            default: {
                this.messageType = -1;
                break
            }
        }

        switch (this.messageType) {
            case MessageType.GTGSM:
            case MessageType.GTLBS: {
                this.type = 'BS';
                break;
            }
            case MessageType.GTSTR: {
                this.type = 'POINT';
                break;
            }
        }
    }


}

module.exports = {
    Gl520Parser
};


