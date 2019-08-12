/**
 * Created by maxislav on 09.08.16.
 */

const livereload = require('gulp-livereload');

module.exports = function (gulp) {

    gulp.task('update', function () {
        return gulp.src('./dist/app/**/*.*').pipe(livereload())
    });


    gulp.task('watch', function() {
        livereload.listen();
        gulp.watch('./*.jade', ['jade']);
        gulp.watch('./**/*.jade', ['jade']);
        gulp.watch('./**/*.html', ['copy']);
        gulp.watch('./src/**/*.less', ['less']);
        gulp.watch('./dist/**/*.*', ['update']);
    });

};