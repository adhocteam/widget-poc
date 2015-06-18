var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    print = require('gulp-print'),
    sass = require('gulp-sass');

gulp.task('default', ['iframe', 'snippet', 'async', 'sass']);

gulp.task('async', function() {
  return gulp.src(['./node_modules/vanilla-modal/dist/vanilla-modal.min.js', './js/async/*.js'])
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
  return gulp.src(['./js/jquery*.js', './node_modules/URIjs/src/URI.min.js', './js/iframe/*.js'])
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
  gulp.watch(['js/iframe/*', 'gulpfile.js'], ['iframe']);
  gulp.watch(['gulpfile.js', 'styles/**/*'],['sass']);
});
