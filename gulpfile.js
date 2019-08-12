/**
 * Created by mars on 2/29/16.
 */
var gulp = require( 'gulp' );
var less = require('gulp-less');

var  livereload = require('gulp-livereload');

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
 * html copy
 */
require('./gulp/html-copy')(gulp);


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