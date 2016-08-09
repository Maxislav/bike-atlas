/**
 * Created by maxislav on 09.07.16.
 */

var jade = require('gulp-jade'),
    livereload = require('gulp-livereload'),
    merge = require('merge-stream'),
    plumber = require('gulp-plumber-notifier');

module.exports = function (gulp) {
    gulp.task('templates', function () {
        var LOCALS = {};
        var
            a = gulp.src('./src/index.jade')
                .pipe(plumber())
                .pipe(jade({
                    locals: LOCALS,
                    pretty: true
                }))
                .pipe(gulp.dest('./'))
                .pipe(livereload()),

            b = gulp.src('./src/**/*.jade')
                .pipe(plumber())
                .pipe(jade({
                    locals: LOCALS,
                    pretty: true
                }))
                .pipe(gulp.dest('./dist/'))
                .pipe(livereload());

        /* b = gulp.src('./src/module/leaflet/template-jade/!**!/!*.jade')
         .pipe(jade({
         locals: LOCALS,
         pretty: true
         }))
         .pipe(gulp.dest('./src/module/leaflet/template/'))
         .pipe( livereload()),

         c =  gulp.src('./src/app/template-jade/!**!/!*.jade')
         .pipe(jade({
         locals: LOCALS,
         pretty: true
         }))
         .pipe(gulp.dest('./src/app/template/'))
         .pipe( livereload());*/

        return merge(a, b);
    });
};