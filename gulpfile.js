var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    print = require('gulp-print'),
    sass = require('gulp-sass'),
    riot = require('gulp-riot'),
    mocha = require('gulp-spawn-mocha');

gulp.task('default', ['iframe', 'snippet', 'async', 'sass-iframe', 'sass-widget']);

gulp.task('async', function() {
  return gulp.src(['./js/polyfills/*.js', './js/common/*.js', './js/async/*.js'])
    .pipe(print())
    //.pipe(uglify())
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

gulp.task('iframe', ['riot'], function(){
  return gulp.src(['./js/polyfills/*.js', './js/common/*.js', './node_modules/riot/riot.js', './node_modules/URIjs/src/URI.js', './js/iframe/*.js', './js/riot/*.js'])
    .pipe(print())
    //.pipe(uglify())
    .pipe(concat('iframe.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('riot', function(){
  return gulp.src('./templates/**/*.tag')
    .pipe(riot({compact: true}))
    .pipe(gulp.dest('./js/riot'));
});

gulp.task('sass-iframe', function () {
  return gulp.src('./styles/iframe/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('iframe.css'))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass-widget', function () {
  return gulp.src('./styles/widget/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('widget.css'))
    .pipe(gulp.dest('./css'));
});

gulp.task('mocha-run',['default'], function() {
  return gulp.src('./test/**/*.js')
    .pipe(print())
    .pipe(mocha({R: 'nyan'}));
});

gulp.task('watch',['default', 'mocha-run'], function () {
  gulp.watch(['js/*', 'gulpfile.js'], ['default']);
  gulp.watch(['js/iframe/*', 'js/polyfills/*.js'], ['iframe']);
  gulp.watch(['js/snippet/*'], ['snippet']);
  gulp.watch(['js/async/*', 'js/polyfills/*.js'], ['async']);
  gulp.watch(['gulpfile.js', 'styles/**/*'],['sass-iframe', 'sass-widget']);
  gulp.watch(['js/**/*', 'test/**/*'],['mocha-run'])
});
