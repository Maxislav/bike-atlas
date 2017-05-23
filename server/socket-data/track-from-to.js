const ProtoData = require('./proto-data');
const R = require('ramda');

const {distance}  = require('../distance');

/**
 * Class olo
 * @extends Array
 */
class Points extends Array{
	constructor(...args){
		super(...args)

	}
}

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

							const points = TrackFromTo._clearTrashPoints(new Points(...rows));

							list.push({userId: device.user_id, name: device.name, points: points});
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

	/**
	 * @param {Points} points
	 * @param {number?} k
	 * @private
	 */
	static _clearTrashPoints(points, k){
		let i = k || 0 ;
		const  point1 = points[i];
		if(!point1 || k==points.length){
			return points
		}else if( 0.1<point1.speed){
			i++;
			return TrackFromTo._clearTrashPoints(points,i)
		}else{
			const arrForSum = [];
			let i2 = i;
			while (i2<points.length-1){
				const point2 = points[i2+1];
				if(distance([point1.lng, point1.lat],[point2.lng, point2.lat])<0.05){
					if(!arrForSum.length) arrForSum.push(point1);
					arrForSum.push(point2);
				}
				i2++
			}
			arrForSum.forEach(point=>{
			 const indexForDel = points.indexOf(point);
				points[indexForDel] = null
			});
			points = points.filter(it=>it);
			i++;
			return TrackFromTo._clearTrashPoints(points,i)
		}

	}

	checkPointExist(){
		
	}
	
}

module.exports = TrackFromTo;