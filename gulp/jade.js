/**
 * Created by maxislav on 09.07.16.
 */

const jade = require('gulp-jade'),
  livereload = require('gulp-livereload'),
  merge = require('merge-stream'),
  plumber = require('gulp-plumber-notifier');

module.exports = function (gulp) {
  gulp.task('jade', function () {
    let LOCALS = {};
    
    let
      a = gulp.src('./src/app/**/*.jade')
        .pipe(plumber())
        .pipe(jade({
          locals: LOCALS,
          pretty: true
        }))
        .pipe(gulp.dest('./src/app'))
        .pipe(livereload());

    let b = gulp.src('./*.jade')
      .pipe(plumber())
      .pipe(jade({
        locals: LOCALS,
        pretty: true
      }))
      .pipe(gulp.dest('./'))
      .pipe(livereload());

    return merge(a, b);
  });
};