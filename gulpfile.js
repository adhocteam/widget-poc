var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    print = require('gulp-print'),
    sass = require('gulp-sass');

gulp.task('default', function() {
  return gulp.src(['./js/jquery*.js', './node_modules/vanilla-modal/dist/vanilla-modal.min.js', './js/*.js'])
    .pipe(print())
    //.pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('iframe', function(){
  return gulp.src(['./js/jquery*.js', './node_modules/URIjs/src/URI.min.js', './js/iframe/*.js'])
    .pipe(print())
    //.pipe(uglify())
    .pipe(concat('iframe.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('sass', function () {
  gulp.src('./styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
  gulp.watch(['js/*', 'gulpfile.js'], ['default']);
  gulp.watch(['js/iframe/*', 'gulpfile.js'], ['iframe']);
  gulp.watch(['gulpfile.js', 'styles/**/*'],['sass']);
});
