/**
 * Created by maxislav on 09.08.16.
 */


module.exports = function (gulp) {
  /*gulp.task('update', function () {
      return gulp.src('./dist/app/!**!/!*.*').pipe(livereload())
  })*/
  gulp.task('watch', function() {
    gulp.watch('./*.jade', ['jade']);
    gulp.watch('./**/*.jade', ['jade']);
    gulp.watch('./src/**/*.less', ['less']);
    // gulp.watch('./dist/**/*.*', ['update']);
  });
  
};