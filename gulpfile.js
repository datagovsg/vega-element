var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var gulpif = require('gulp-if');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('deploy', function() {
  return gulp.src(['./gh_pages/*','./gh_pages/*/**'])
    .pipe(ghPages());
});

// copy component files to tmp folder
gulp.task('html', function() {
  return gulp.src('./es6/*.html')
    .pipe(gulpif('*.html', crisper({ scriptInHead:false }))) // Extract JS from .html files
    .pipe(gulpif('*.js', babel({ presets: ['es2015'] })))
    .pipe(gulp.dest('./tmp/vega-element'));
});

// copy bower dependencies to tmp folder
gulp.task('bower', function() {
  return gulp.src('bower_components/*/**')
    .pipe(gulp.dest('./tmp/'));
});

gulp.task('vulcanize', function () {
	return gulp.src('./tmp/vega-element/index.html')
		.pipe(vulcanize({
      inlineScripts: true,
      inlineCss: true,
      excludes: ['./tmp/vega-element/vega-element.html']
		}))
		.pipe(gulp.dest('./gh_pages/'));
});

gulp.task('vulcanize2', function () {
	return gulp.src('./tmp/vega-element/vega-element.html')
		.pipe(vulcanize({
      inlineScripts: true,
      inlineCss: true,
		}))
		.pipe(gulp.dest('./gh_pages/'));
});

gulp.task('es5', function () {
	return gulp.src('./es6/*.html')
    .pipe(gulpif('*.html', crisper({ scriptInHead:false }))) // Extract JS from .html files
    .pipe(gulpif('*.js', babel({ presets: ['es2015'] })))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulp.dest('.'));
});

gulp.task('demo', function () {
	return gulp.src('./demo/*.*')
    .pipe(gulp.dest('./gh_pages/demo'));
});

// Clean output directory
gulp.task('clean', function() {
  return del(['./tmp']);
});

gulp.task('default', function(cb) {
  runSequence(['clean','clean_gh_pages','demo'],['html', 'bower'],['vulcanize','vulcanize2'],['clean'],cb);
});
