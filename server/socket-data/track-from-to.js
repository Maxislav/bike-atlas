const util = require('./util');
const ProtoData = require('./proto-data');
const R = require('ramda');

class TrackFromTo extends ProtoData {
	constructor(socket, connection) {
		super(socket, connection);
		socket.on('trackFromTo', this.trackFromTo.bind(this, 'trackFromTo'));
		socket.on('getLastDate', this.getLastDate.bind(this, 'getLastDate'));
		socket.on('delPoints', this.delPoints.bind(this, 'delPoints'));
	}

	getLastDate(eName) {
		let _userId;
		this.getUserId()
			.then(userId => {
				_userId = userId;
				return util.getDeviceByUserId(this.connection, userId)
			})
			.then(devices=> {
				const keys = [];
				devices.forEach(device=> {
					keys.push(device.device_key)
				});
				return util.getLastDateTrack(this.connection, keys.join(","))
			})
			.then(rows=> {
				this.socket.emit(eName, rows)
			})
			.catch(err => {
				console.error('Error getLastDate ->', err)
			})


	}


	trackFromTo(eName, data) {

		Promise.all([
			this.getUserId(),
			this.getFriendsIds()
		])
			.then(([userId, friendIds])=> {
				const ids = [].concat([userId]).concat(friendIds)
				return util.detDeviceByUserId(this.connection, ids.join(','))

			})
			.then(devices=> {
				const promises = [];
				const list = [];

				devices.forEach(/** @param {{device_key: String}} device */(device) => {
					promises.push(util.getTrackFromTo(this.connection, device.device_key, data.from, data.to)
						.then(rows=> {
							list.push({userId: device.user_id, name: device.name, points: rows});
							return rows
						})
					)
				});
				return Promise.all(promises)
					.then(rows=> {
						return list
					})


			})
			.then(list=> {
				this.socket.emit(eName, {
					result: 'ok',
					list: list
				})
			})
			.catch(err => {
				console.error('Error trackFromTo ->', err)
			})


	}

	delPoints(eName, points) {
		this.getUserId()
			.then(userId => {
				return util.getDeviceByUserId(this.connection, userId)
			})
			.then(devices => {
				const deviceKeys = R.pluck('device_key')(devices);
				const arrPromise = [];

				points.forEach(pointId=> {
					arrPromise.push(util.getDeviceKeyByPointId(this.connection, pointId)
						.then(device=> {
							return deviceKeys.indexOf(device.device_key)
						})
					)
				});
				return Promise.all(arrPromise);
			})
			.then(arr=> {
				if (arr.find((a)=>a == -1)) {
					return Promise.reject('no found link device')
				} else {
					return util.delPointsByIds(this.connection, points.join(','))
				}
			})
			.then(rows=> {
				this.socket.emit(eName, {
					result: 'ok'
				})
			})
			.catch(err => {
				console.error('Error delPoints ->', err)
				this.socket.emit(eName, {
					result: false,
					message: err
				})
			})
	}


}

module.exports = TrackFromTo;