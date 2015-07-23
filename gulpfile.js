var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    print = require('gulp-print'),
    sass = require('gulp-sass'),
    riot = require('gulp-riot'),
    mocha = require('gulp-spawn-mocha'),
    plumber = require('gulp-plumber'),
    zip = require('gulp-zip'),
    gulpif = require('gulp-if');

gulp.task('default', ['watch', 'build', 'mocha-run']);

gulp.task('build', ['iframe', 'html-copy', 'snippet', 'async', 'sass-iframe', 'sass-widget']);

var shouldUglify = function(){
  return !!process.env.shouldUglify;
}

var distDir = function(){
  return process.env.distDir || './dist';
}

gulp.task('async', function() {
  return gulp.src(['./js/polyfills/*.js', './js/common/*.js', './js/async/*.js'])
    .pipe(print())
    .pipe(gulpif(shouldUglify, uglify()))
    .pipe(concat('async.js'))
    .pipe(gulp.dest(distDir()));
});

gulp.task('snippet', function() {
  return gulp.src(['./js/snippet/*.js'])
    .pipe(print())
    .pipe(concat('snippet.js'))
    .pipe(gulp.dest(distDir()));
});

gulp.task('iframe', ['riot'], function(){
  return gulp.src(['./js/polyfills/*.js', './node_modules/underscore/underscore.js', './node_modules/reqwest/reqwest.js', './node_modules/q/q.js', './js/common/*.js', './node_modules/riot/riot.js', './node_modules/URIjs/src/URI.js', './js/iframe/*.js', './js/iframe/app/*.js','./js/iframe/app/**/*.js',  './js/riot/*.js'])
    .pipe(print())
    .pipe(gulpif(shouldUglify, uglify()))
    .pipe(concat('iframe.js'))
    .pipe(gulp.dest(distDir()));
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
    .pipe(gulp.dest(distDir()));
});

gulp.task('sass-widget', function () {
  return gulp.src('./styles/widget/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('widget.css'))
    .pipe(gulp.dest(distDir()));
});

gulp.task('html-copy', function(){
  return gulp.src('./html/embed.html')
    .pipe(concat('iframe.html'))
    .pipe(gulp.dest(distDir()));
});

gulp.task('release-files', function(){
  return gulp.src('./doc/*.md')
    .pipe(gulp.dest(distDir()+'/doc'));
});

var releaseRoot = function(){
  var p = require('./package.json');
  return 'plan_compare_widget-'+ p.version;
}

gulp.task('copy-release', ['build', 'release-files'], function(){
  return gulp.src(distDir()+'/**/*')
    .pipe(print())
    .pipe(gulp.dest('./releases/'+releaseRoot()));
});

gulp.task('production-settings', function(){
  //process.env.shouldUglify = true;
  process.env.distDir = './releases/dist/';
});

gulp.task('package-release', ['production-settings', 'copy-release'], function(){
  var base = './releases/';
  return gulp.src(base+releaseRoot()+'/**/*', {base: base})
    .pipe(zip(releaseRoot()+'.zip'))
    .pipe(gulp.dest('releases'));
});

gulp.task('mocha-run', function() {
  return gulp.src('./test/**/*.js')
    .pipe(print())
    .pipe(plumber({errorHandler: function(err){
      this.emit('end');
    }}))
    .pipe(mocha({R: 'nyan'}));
});

gulp.task('watch',['mocha-run'], function () {
  gulp.watch(['./templates/**/*.tag'],['riot'])
  gulp.watch(['js/*', 'gulpfile.js'], ['default']);
  gulp.watch(['html/*'], ['html-copy']);
  gulp.watch(['js/iframe/**/*', 'js/polyfills/*.js'], ['iframe']);
  gulp.watch(['js/snippet/*'], ['snippet']);
  gulp.watch(['js/async/*', 'js/polyfills/*.js'], ['async']);
  gulp.watch(['gulpfile.js', 'styles/**/*'],['sass-iframe', 'sass-widget']);
  gulp.watch(['js/**/*', 'test/**/*'],['mocha-run'])
});
