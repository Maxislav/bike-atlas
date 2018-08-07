/**
 * Created by mars on 2/29/16.
 */
var gulp = require( 'gulp' );
var less = require('gulp-less');
var path = require('path');

var  livereload = require('livereload');
const server = livereload.createServer({
    delay : 2000
});
server.watch(path.resolve(__dirname, 'dist'));
const devSyncTask = [
	'less',
	'jade',
	'watch'
];

const gulpSync = require('gulp-sync')(gulp).sync;


/**
 * Jade
 */
require('./gulp/jade')(gulp);

/**
 * less
 */
require('./gulp/less')(gulp);

/**
 * watch
 */
 require('./gulp/watch')(gulp);

/*

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('app/less/!*.less', ['less']);
});
*/


gulp.task('default', gulpSync(devSyncTask));