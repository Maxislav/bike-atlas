const ProtoData = require('./proto-data');
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const https = require('https');

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
						this.socket.emit(eName, d)
					})

			})
			.catch(err=>{
				console.error('util.setFacebookUser -> ', err)
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