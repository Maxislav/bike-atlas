/**
 * Created by maxislav on 09.07.16.
 */

var jade = require('gulp-jade'),
    livereload = require('gulp-livereload'),
    merge = require('merge-stream'),
    plumber = require('gulp-plumber-notifier');

module.exports = function (gulp) {
    gulp.task('jade', function () {
        var LOCALS = {};
        var
            a = gulp.src('./src/**/*.jade')
                .pipe(plumber())
                .pipe(jade({
                    locals: LOCALS,
                    pretty: true
                }))
                .pipe(gulp.dest('./dist'))
                .pipe(livereload());

        return merge(a);
    });
};