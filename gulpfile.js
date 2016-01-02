"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local dev server
var open = require('gulp-open'); //Open a URL in a web browser
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify');  // Transforms React JSX to JS
var source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
var concat = require('gulp-concat'); //Concatenates files
var lint = require('gulp-eslint'); //Lint JS files, including JSX
var glob = require('glob');

var srcRoot = './src';

var config = {
  paths: {
    html: srcRoot +'/*.html',
    js: srcRoot + '/**/*.js',
    jsx: srcRoot + '/jsx/**/*.jsx',
    css: srcRoot + '/**/*.css',
    sass: srcRoot + '/**/*.scss',
    vendor: { 
      css: [
        'bower_components/foundation-sites/dist/foundation.min.css',
      ],
      js: [],
    },
    dist: './dist',
    appJs: srcRoot+ "/js/app.js" 
  }
}



gulp.task('jsx', function() {
  var files = glob.sync(config.paths.jsx);
  browserify({entries: files})
  .transform(reactify)
  .bundle()
  .pipe(source('components.js'))
  .pipe(gulp.dest(config.paths.dist + '/js'))
});

gulp.task('appjs', function() {
  browserify(config.paths.appJs)
  .bundle()
  .on('error', console.error.bind(console))
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(config.paths.dist + '/js'))
});


gulp.task('css', function() {
  gulp.src(config.paths.vendor.css)
  .pipe(concat('bundle.css'))
  .pipe(gulp.dest(config.paths.dist + '/css'));
});


gulp.task('html', function() {
  gulp.src(config.paths.html)
  .pipe(gulp.dest(config.paths.dist))
  .pipe(connect.reload());
});





gulp.task('lint', function() {
  return gulp.src(config.paths.js)
  .pipe(lint({config: 'eslint.config.json'}))
  .pipe(lint.format());
});

gulp.task('watch', function() {
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html', 'js', 'css', 'lint', 'open', 'watch']);
