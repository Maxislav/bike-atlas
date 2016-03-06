/**
 * Created by mars on 3/2/16.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


var http = require( "http" ),
	url = require( "url" ),
	path = require( "path" ),
	fs = require( "fs" ),
	port = 8080, //default 80
	https = require( 'https' ),
	mime = require( 'mime' ),
	colors = require( 'colors' );

var proxi = {
	source: '^\/data.+',
	data: {
		hostname: 'devdat.loyverse.com',
		port: 12739
	}
};


var server = new http.Server();
var timer = timerFoo();

function timerFoo(){
	return setTimeout(function(){
		console.log('=======================+++++++++++++++++++++=========================='.red)
	},1000 )
};

server.on( 'request', function ( request, response ) {
	clearTimeout(timer);
	timer = timerFoo();

	var uri = url.parse( request.url ).pathname;
	if ( !checkAccess( request ) ) {
		response.status = 403;
		response.end( 'Error access' );
		console.log( 'Error access'.red );
		return;
	}
	var proxiRegex = new RegExp( proxi.source );
	if ( proxiRegex.test( uri ) ) {
		proxiServ( request, response, new Date().getTime() );
		return;
	}
	var t0 = new Date().getTime();
	sendFileSave( url.parse( request.url ).pathname, response, t0 );
} );

function checkAccess( req ) {
	return url.parse( req.url, true ).query.secret != 'o_O';
}

function sendFileSave( filePath, res, timeLong ) {

	if ( /\/$/.test( filePath ) ) {
		filePath += 'index.html';
	}

	try {
		filePath = decodeURIComponent( filePath );
	} catch ( err ) {
		res.status = 400;
		res.end( 'Bad request' );
		return;
	}

	if ( ~filePath.indexOf( '\0' ) ) {
		res.status = 400;
		res.end( 'Bad request' );
		return;
	}
	filePath = path.join( process.cwd(), filePath );
	fs.stat( filePath, function ( err, status ) {
		if ( err || !status.isFile() ) {
			res.status = '404';
			res.end( 'File not found' );
			return;
		}
		var file = new fs.ReadStream( filePath )
		sendFile( file, filePath, res, timeLong );

	} )

}

function sendFile( file, filename, res, timeLong ) {

	var headers = {};

	var contentType = mime.lookup( filename );
    if(contentType == 'text/html'){
        contentType+="; charset=UTF-8";
    }
	if ( contentType ) headers["Content-Type"] = contentType;
	res.writeHead( 200, headers );
	file.pipe( res );

	file.on( 'error', function ( err ) {
		res.statuscode = 500;
		res.end( 'Server error' );
		console.error( err )
	} );

	file.on( 'end', function () {
		var resTime = new Date().getTime() - timeLong + 'ms';
		console.log( filename + " : " + resTime )
	} );

	res.on( 'close', function () {
		file.destroy();
	} );


}

function proxiServ( request, response, timeLong ) {
	var ph = url.parse( request.url );
	var options = {
		port: proxi.data.port,
		hostname: proxi.data.hostname,
		method: request.method,
		path: ph.path,
		headers: request.headers
	};

	var proxyRequest = https.request( options );
	proxyRequest.on( 'response', function ( proxyResponse ) {
		proxyResponse.on( 'data', function ( chunk ) {

			response.write( chunk, 'binary' );
		} );
		proxyResponse.on( 'end', function () {
			response.end();
			var resTime = new Date().getTime() - timeLong + '';
			console.log( (url.parse( request.url ).pathname + " : " + resTime + 'ms').green );

		} );
		response.writeHead( proxyResponse.statusCode, proxyResponse.headers )
	} );
	request.on( 'data', function ( chunk ) {
		proxyRequest.write( chunk, 'binary' )
	} );
	request.on( 'end', function () {
		proxyRequest.end()
	} );
}


server.listen( port );
console.log( 'Server start on port: ' + port );