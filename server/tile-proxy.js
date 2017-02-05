const http = require( "http" );
module.exports = function (req, res, next) {
  let opt = {
    port: 80,
    hostname: 'hills.gpsies.com',
    method: req.method,
    path: '/'+ req.params.z+'/'+req.params.x+'/'+req.params.y,
    headers: req.headers
  };
  res.header("Access-Control-Allow-Origin", "http://178.62.44.54");
  const proxyRequest = http.request( opt );
  proxyRequest.on( 'response', function ( proxyResponse ) {
    proxyResponse.on( 'data', function ( chunk ) {
      res.write( chunk, 'binary' );
    } );
    proxyResponse.on( 'end', function () {
      res.end();
    } );
      proxyResponse.header("Access-Control-Allow-Origin", "http://178.62.44.54");
    res.writeHead( proxyResponse.statusCode, proxyResponse.headers );
      res.writeHead("Access-Control-Allow-Origin: http://178.62.44.54");
     // res.header("Access-Control-Allow-Origin", "http://178.62.44.54");
  } );
  proxyRequest.on('error', function(err){
    res.statusCode = 204;
    res.end( 'No connect' );
  });
  req.on( 'data', function ( chunk ) {
    proxyRequest.write( chunk, 'binary' );
  } );
  req.on( 'end', function () {
    proxyRequest.end();
  } );
};
