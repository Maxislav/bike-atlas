

const MessageType = {
    GTSTR: 0,
    GTLBS: 1,
    GTGSM: 2
};


class Gl520Parser{
    constructor(){
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
         * @private
         * @type {String}
         */
        this.messageTypeString = null;

        this._data = null
    }

    /**
     *
     * @param d
     * @returns {Gl520Parser}
     */
    setSrcData(d){
        this.srcMsg = d;
        this._data = this._parse();
        return this;
    }

    getData(){
        return this._data;
    }


    _parse(){
        const respData = {
            alt: null,
            lng: null,
            lat: null,
            azimuth: null,
            speed: null,
            src: null,
            date: null
        };
        respData.src = this.srcMsg;
        return Object.assign(respData, this._parseData());
    }

    /**
     *
     * @returns {*}
     * @private
     */
    _parseData() {
        const messageType = this._getType();
        if(messageType === null){
            return null;
        }
        switch (messageType){
            case MessageType.GTGSM:
            case MessageType.GTLBS: {
                this.type = 'BS';
                break;
            }
            case MessageType.GTSTR: {
                this.type = 'POINT'
            }
        }
        const arr = this.srcMsg.split(',');
        /**
         * @type {string}
         */
        const srcDate = arr[15];

        return {
            device_key: arr[2],
            id: arr[2],
            speed: arr[10],
            azimuth: arr[11],
            alt: arr[12],
            lng: arr[13],
            lat: arr[14],
            type: this.type,
            date: new Date(Number(srcDate.slice(0,4)),
                Number(srcDate.slice(4,6))-1,
                Number(srcDate.slice(6,8)),
                Number(srcDate.slice(8,10)),
                Number(srcDate.slice(10,12)),
                Number(srcDate.slice(12,14)))
        }
    }

    _getType() {
        const str = this.srcMsg;
        switch (true) {
            case !str: {
                return null;
            }
            case typeof str !== 'string': {
                return null;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTSTR,\d+,\d+,.+/): {
                this.messageTypeString = 'GTSTR';
                return MessageType.GTSTR;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTLBS,\d+,\d+,.+/): {
                this.messageTypeString = 'GTLBS';
                return MessageType.GTLBS;
            }
            case !!str.match(/^([\s]+)?\+?RESP:GTGSM,\d+,\d+,.+/): {
                this.messageTypeString = 'GTGSM';
                return MessageType.GTGSM;
            }
            default: {
                return null;
            }
        }
    }
}

module.exports ={
    Gl520Parser
};


