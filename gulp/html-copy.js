module.exports = function (gulp) {
    gulp.task('copy', function () {
        return  gulp.src('./src/app/**/*.html')
            .pipe(gulp.dest('./dist/app'))
    })
};
