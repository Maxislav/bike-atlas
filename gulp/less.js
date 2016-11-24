/**
 * Created by maxislav on 11.10.16.
 */
var  livereload = require('gulp-livereload');
var less = require('gulp-less');
var path = require('path');

module.exports = function (gulp) {

  gulp.task('less', function () {
    return gulp.src('src/app/**/*.less')
      .pipe(less({
        paths: [ path.join(__dirname, 'less', 'includes') ]
      }))
      .pipe(gulp.dest('src/app/'))
      .pipe(livereload());
  });
  
};