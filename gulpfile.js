var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    print = require('gulp-print');

gulp.task('default', function() {
  return gulp.src(['./js/jquery*.js', './js/*.js'])
    .pipe(print())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('iframe', function(){
  return gulp.src(['./js/jquery*.js', './node_modules/URIjs/src/URI.min.js', './js/iframe/*.js'])
    .pipe(print())
    .pipe(uglify())
    .pipe(concat('iframe.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function () {
  gulp.watch(['js/**/*', 'gulpfile.js'], ['default', 'iframe']);
});
