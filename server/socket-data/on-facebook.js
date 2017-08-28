const ProtoData = require('./proto-data');

class OnFacebook extends ProtoData{
	constructor(socket, util) {
		super(socket, util);

		this.socket.on('setFacebookUser', this.setFacebookUser.bind(this, 'setFacebookUser'));
	}

	/**
	 *
	 * @param {string}eName
	 * @param {Object}data
	 * @param {number} data.userID
	 * @param {string } data.hash
	 * @param {string} data.accessToken
	 * @param {string} data.name
	 * @return {Promise}
	 */
	setFacebookUser(eName, data){
		const hash = this.util.getHash();

		this.util.setFacebookUser({
			name: data.name,
			accessToken: data.accessToken,
			hash: hash,
			userID: data.userID
		})
			.then(d=>{
				this.socket.emit(eName, d)
			})
			.catch(err=>{
				console.error('util.setFacebookUser -> ', err)
			})


	}
}

module.exports = OnFacebook;