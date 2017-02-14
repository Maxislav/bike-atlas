const ProtoData = require('./proto-data');
const R = require('ramda');

class TrackFromTo extends ProtoData {
	constructor(socket, util) {
		super(socket, util);
		socket.on('trackFromTo', this.trackFromTo.bind(this, 'trackFromTo'));
		socket.on('getLastDate', this.getLastDate.bind(this, 'getLastDate'));
		socket.on('delPoints', this.delPoints.bind(this, 'delPoints'));
		socket.on('downloadTrack', this.downloadTrack.bind(this, 'downloadTrack'));
	}



	getLastDate(eName) {
		let _userId;
		this.getUserId()
			.then(userId => {
				_userId = userId;
				return this.util.getDeviceByUserId(userId)
			})
			.then(devices=> {
				const keys = [];
				devices.forEach(device=> {
					keys.push(device.device_key)
				});
				return this.util.getLastDateTrack(keys.join(","))
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
				return this.util.detDeviceByUserId(ids.join(','))

			})
			.then(devices=> {
				const promises = [];
				const list = [];

				devices.forEach(/** @param {{device_key: String}} device */(device) => {
					promises.push(this.util.getTrackFromTo(device.device_key, data.from, data.to)
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
				return this.util.getDeviceByUserId(userId)
			})
			.then(devices => {
				const deviceKeys = R.pluck('device_key')(devices);
				const arrPromise = [];

				points.forEach(pointId=> {
					arrPromise.push(this.util.getDeviceKeyByPointId(pointId)
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
					return this.util.delPointsByIds(points.join(','))
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

	downloadTrack(eName, points){
		this.getUserId()
			.then(userId => {
				return this.util.getDeviceByUserId(userId)
			})
			.then(devices=>{
				if(!devices.length){
					this.socket.emit( eName,{
						result: false,
						message: 'devices empty'
					});
					return Promise.reject('devices empty')
				}else{
					return  devices[0].device_key
				}
			})
			.then(deviceKey=>{
				return Promise.all(points.map(point=>{
					return this.util.downloadTrack(deviceKey, point)
				}))
			})
			.then(dd=>{
				this.socket.emit(eName, {
					result: 'ok'
				})
			})
			.catch(err=>{
				if(err){
					this.socket.emit(eName, {
						result: false,
						message: err
					})
				}
				console.log('Error downloadTrack->', err)
			})

	}
	checkPointExist(){
		
	}
	
}

module.exports = TrackFromTo;