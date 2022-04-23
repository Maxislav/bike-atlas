import {ProtoData} from './proto-data';

const R = require('ramda');
class OnChat extends ProtoData {
    constructor(socket, util, public chat) {
        super(socket, util);
        this.socket.on('onChatSend', this.onChatSend.bind(this, 'onChatSend'));
        this.socket.on('chatHistory', this.chatHistory.bind(this, 'chatHistory'));
        this.socket.on('chatUnViewed', this.chatUnViewed.bind(this, 'chatUnViewed'));
        this.socket.on('chatResolveUnViewed', this.chatResolveUnViewed.bind(this, 'chatResolveUnViewed'));


    }

    chatResolveUnViewed(eName, mesIds) {
        if (mesIds) {
            this.getUserId()
                .then(userId => {
                    return this.util.chatResolveUnViewed(userId, mesIds.join(","))
                        .then(rows => {
                            this.socket.emit(eName, {
                                result: 'ok'
                            })
                        })
                })
                .catch(err => {
                    console.error(eName, '->', err)
                })
        } else {
            this.socket.emit(eName, {
                result: 'ok'
            })
        }


    }

    onChatSend(eName, data) {
        const toUserId = data.id;
        //util.getUserIdBySocketId(this.connection, this.socket.id)
        this.getUserId()
            .then(userId => {
                const resData = {
                    toUserId: toUserId,
                    fromUserId: userId,
                    date: new Date(),
                    text: data.text,
                    id: null
                };
                return this.util.onChatSend(resData)
                    .then(rows => {
                        resData.id = rows.insertId;
                        this.chat.onChatSend(resData);
                        this.socket.emit(eName, resData);
                    })
            })
            .catch(err => {
                console.error(eName, '->', err)
            })
    }

    chatHistory(eName, opponentId) {
        this.getUserId()
            .then(userId => {
                return this.util.chatHistory(userId, opponentId)
                    .then(arrRows => {
                        const ownMess = formatMess(arrRows[0], true);
                        const outMess = formatMess(arrRows[1], false);
                        let result = ownMess.concat(outMess);

                        result = result.sort(function (a, b) {
                            const aTime = new Date(a.date).getTime();
                            const bTime = new Date(b.date).getTime();

                            if (aTime > bTime) {
                                return 1;
                            }
                            if (aTime < bTime) {
                                return -1;
                            }
                            return 0;
                        });

                        this.socket.emit(eName, result)
                    })
            })
            .catch(err => {
                    console.error('Error chatHistory->', err)
            })


    }

    chatUnViewed(eName) {
        this.getUserId()
            .then(userId => {
                return this.util.chatUnViewed(userId)
                    .then(rows => {
                        rows = formatMess(rows);
                        let userIds = R.uniq(R.pluck('fromUserId')(rows)) || [];
                        const res = {};
                        userIds.forEach(id => {
                            const mess = rows.filter(mes => {
                                return mes.fromUserId == id
                            });
                            res[id] = R.pluck('id')(mess)
                        });

                        this.socket.emit(eName, res)
                    })
            })
            .catch(err => {
                console.error('Error',eName,'->', err)
            })

    }
}


function formatMess(mess, own?) {
    const res = [];

    mess.forEach(mes => {
        const _mes = {};
        for (let key in mes) {
            _mes[camelCased(key)] = mes[key]
        }
        if (own !== undefined) {
            _mes['isMy'] = own;
        }

        res.push(_mes)
    });
    return res
}

function camelCased(myString) {
    return myString.replace(/_([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}

module.exports = OnChat;
