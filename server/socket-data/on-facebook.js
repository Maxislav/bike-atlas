const ProtoData = require('./proto-data');
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const https = require('https');
const Stream = require('stream').Transform;
const base64ArrayBuffer = require('../base-64-array-buffer');

const jsonToQuery = (obj) =>{
	let str = '?';
	const arr = [];

	for(let key in obj){
		arr.push({
			key: key,
			value: obj[key]
		})
	}

	arr.forEach((it, i)=>{
		str+=it.key+'='+encodeURIComponent(it.value)
		if(i!=arr.length-1) str+='&'
	})
	return str

}

class OnFacebook extends ProtoData{
	constructor(socket, util) {
		super(socket, util);

		this.socket.on('setFacebookUser', this.setFacebookUser.bind(this, 'setFacebookUser'));
		this.socket.on('disconnect', this.onDisconnect.bind(this, 'disconnect'));
	}

	/**
	 *
	 * @param {string}eName
	 * @param {Object} data
	 * @param {number} data.userID
	 * @param {string }data.hash
	 * @param {string} data.accessToken
	 * @param {string} data.name
	 * @return {Promise}
	 */
	setFacebookUser(eName, data){
		const hash = this.util.getHash();


		this._confirmUser(data)
			.then(user=>{
				if(user.id == data.userID ){
					return user
				}
				return Promise.reject()
			})
			.then(user=>{
				this.util.setFacebookUser({
					name: data.name,
					accessToken: data.accessToken,
					hash: hash,
					userID: data.userID
				}, this.socket.id)
					.then(d=>{
						this.socket.emit(eName,	Object.assign({result:'ok'}, {user:d}))
					})
			})
			.then(img=>{
				return this._getPhoto(data)
			})
			.then(location=>{
				return this._getRedirect(location)
			})
			.then(d=>{
				'data:image/png;base64,' + d
			})
			.catch(err=>{
				console.error('util.setFacebookUser -> ', err)
			})

	}

	onDisconnect(eName){
		this.util.clearFbHash(this.socket.id)
	}

	/**
	 *
	 * @private
	 * @param {Object} data
	 * @param {number} data.userID
	 * @param {string }data.hash
	 * @param {string} data.accessToken
	 * @param {string} data.name
	 * @return {Promise}
	 */
	_getPhoto(data){
		return new Promise((res, rej)=>{
			const options = {
				host: 'graph.facebook.com',
				port: 443,
				path: '/v2.10',
				method: 'GET'
			};

			const p = {
				access_token: data.accessToken,
				method: 'get'
			};
			options.path+= `/${data.userID}/picture`+jsonToQuery(p);
			https.request(options, function (response) {
				var data = [];
				response.on('data', function (chunk) {
					data.push(chunk);
				});
				response.on('end', function () {
					response

					res(response.headers.location)
				});
				response.on('error', function (err) {
					console.error(err);
					rej(err)
				});
			}).end();
		})
	}

	_getRedirect(str){
		const host = str.match(/^https?:\/\/[^\/]+/)[0];
		const path = str.replace(host, '')

		const options = {
			host: host.replace(/^https?:\/\//, ''),
			port: 443,
			path: path,
			method: 'GET'
		};

		return new Promise((res, rej)=>{
			https.request(options, function (response) {
				const data = [];
				response.on('data', function (chunk) {
					data.push(chunk);
				});
				response.on('end', function () {

					const d = data.map(it=>{
						return Array.from(it)
					})
					//const u8arr = new Uint8Array()

				//	btoa(String.fromCharCode.apply(null, u8arr))
					res(base64ArrayBuffer([].concat(...d)))
				});
				response.on('error', function (err) {
					console.error(err);
					rej(err)
				});
			}).end();
		})
	}

	/**
	 *
	 * @private
	 * @param {Object} data
	 * @param {number} data.userID
	 * @param {string }data.hash
	 * @param {string} data.accessToken
	 * @param {string} data.name
	 * @return {Promise}
	 */
	_confirmUser(data){
		return new Promise((res, rej)=>{
			const options = {
				host: 'graph.facebook.com',
				port: 443,
				path: '/v2.8/me',
				method: 'GET'
			};

			const p = {
				access_token: data.accessToken,
				method: 'get',
				pretty: 1
			};
			options.path+=jsonToQuery(p);
			https.request(options, function (response) {
				let str = '';
				response.on('data', function (chunk) {
					str += chunk;
				});
				response.on('end', function () {
					let obj;
					try{
						obj = JSON.parse(str)
					}catch (err){
						console.error(err);
						return Promise.reject(err)
					}

					res(obj)
				});
				response.on('error', function (err) {
					console.error(err);
					rej(err)
				});
			}).end();
		})
			.catch(err=>{
				console.log(err)
			})
	}
}

module.exports = OnFacebook;