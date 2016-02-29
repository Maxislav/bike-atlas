/**
 * Created by mars on 2/29/16.
 */
var gulp = require( 'gulp' );
var less = require('gulp-less');
var path = require('path');
var  livereload = require('gulp-livereload');

gulp.task('less', function () {
	return gulp.src('app/less/**/*.less')
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		}))
		.pipe(gulp.dest('dest/css'))
	.pipe(livereload());
});

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('app/less/**/*.less', ['less']);
});