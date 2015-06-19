var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    print = require('gulp-print'),
    sass = require('gulp-sass');

gulp.task('default', ['iframe', 'snippet', 'async', 'sass']);

gulp.task('async', function() {
  return gulp.src(['./js/polyfills/*.js', './node_modules/vanilla-modal/dist/vanilla-modal.js', './js/async/*.js'])
    .pipe(print())
    .pipe(uglify())
    .pipe(concat('async.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('snippet', function() {
  return gulp.src(['./js/snippet/*.js'])
    .pipe(print())
    .pipe(uglify())
    .pipe(concat('snippet.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('iframe', function(){
  return gulp.src(['./js/polyfills/*.js', './node_modules/URIjs/src/URI.js', './js/iframe/*.js'])
    .pipe(print())
    .pipe(uglify())
    .pipe(concat('iframe.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('sass', function () {
  return gulp.src('./styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
  gulp.watch(['js/*', 'gulpfile.js'], ['default']);
  gulp.watch(['js/iframe/*', 'js/polyfills/*.js'], ['iframe']);
  gulp.watch(['js/snippet/*'], ['snippet']);
  gulp.watch(['js/async/*', 'js/polyfills/*.js'], ['async']);
  gulp.watch(['gulpfile.js', 'styles/**/*'],['sass']);
});
