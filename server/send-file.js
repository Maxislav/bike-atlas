const mime = require( 'mime' );


const videoSend = (file, filename, res, timeLong)=> {
	res.sendFile(filename);
	var resTime = new Date().getTime() - timeLong + 'ms';
	console.log( filename + " : " + resTime );
	return null;
}

const sendFile = ( file, filename, res, timeLong ) => {
	'use strict';

	var headers = {};

	var contentType = mime.lookup( filename );
	if(contentType == 'text/html'){
		contentType+="; charset=UTF-8";
	}
	if ( contentType ) {
		headers["Content-Type"] = contentType;

		if(contentType.match(/^video/)){
			return videoSend(...arguments)
		}

		console.log('Content-Type ->', contentType)
	}
	res.writeHead( 200, headers );
	file.pipe( res );
	file.on( 'error', function ( err ) {
		res.statuscode = 500;
		res.end( 'Server error' );
		console.error( err );
	} );

	file.on( 'end', function () {
		var resTime = new Date().getTime() - timeLong + 'ms';
		console.log( filename + " : " + resTime );
	} );

	res.on( 'close', function () {
		file.destroy();
	} );
};

module.exports = {sendFile};
