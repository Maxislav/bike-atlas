/**
 * Created by mars on 3/2/16.
 */
var http = require('http');
var url = require('url');
var httpServer = require('http-server');


console.log('dsd');

/*var server = http.createServer(function(request, response) {
	//console.log(request.url)
	var ph = url.parse(request.url)
	var options = {
		port: ph.port,
		hostname: ph.hostname,
		method: request.method,
		path: ph.path,
		headers: request.headers
	};

	if(/^\/data.+/.test(ph.path)){
		console.log(ph.path)
	}

	/!*if(request.method == "POST"){
		console.log(ph.path);
	}*!/

	var proxyRequest = http.request(options)
	proxyRequest.on('response', function(proxyResponse) {
		proxyResponse.on('data', function(chunk) {
			response.write(chunk, 'binary')
		});
		proxyResponse.on('end', function() { response.end() })
		response.writeHead(proxyResponse.statusCode, proxyResponse.headers)
	});
	request.on('data', function(chunk) {
		proxyRequest.write(chunk, 'binary')
	});
	request.on('end', function() { proxyRequest.end() })
}).listen(8080);*/
var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	port = process.argv[2] || 8888;

http.createServer(function(request, response) {
	var uri = url.parse(request.url).pathname;
	var filename = path.join(process.cwd(), uri);

	if(uri == '/'){
		filename = 'index.html';
	}

	if(/^\/data.+/.test(filename)){
		console.log(filename)
	}

	var contentTypesByExtension = {
		'.html': "text/html",
		'.css':  "text/css",
		'.js':   "text/javascript"
	};



	fs.exists(filename, function(exists) {
		if(!exists) {
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		if (fs.statSync(filename).isDirectory()) filename += '/index.html';

		fs.readFile(filename, "binary", function(err, file) {
			if(err) {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}

			var headers = {};
			var contentType = contentTypesByExtension[path.extname(filename)];
			if (contentType) headers["Content-Type"] = contentType;
			response.writeHead(200, headers);
			response.write(file, "binary");
			response.end();
		});
	});
}).listen(8080);



console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");