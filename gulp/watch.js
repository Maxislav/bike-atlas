/**
 * Created by maxislav on 09.08.16.
 */

const livereload = require('gulp-livereload');

module.exports = function (gulp) {

  gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('./src/**/*.jade', ['jade']);
  });
  
};