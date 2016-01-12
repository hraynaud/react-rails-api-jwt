var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

var path = {
  HTML: 'src/index.html',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  DEST_PROD: 'public',
  DEST_DEV: 'dist/dev',
  ENTRY_POINT: './src/js/App.js'
};

var sassConfig = {
    includePaths: ['bower_components/foundation/scss/'],
    outputStyle: 'expanded',
    errLogToConsole: true
};

gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});

gulp.task('styles', function(){

  return gulp.src('src/scss/app.scss')
  .pipe(sass({
    includePaths: [ './bower_components/foundation-sites/assets', './bower_components/foundation-sites/scss'],
  }))
    .pipe(concat("app.css"))
    .pipe(gulp.dest("dist/dev/css"));
})

gulp.task('replaceHTMLsrc', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'js/' + path.OUT
    }))
    .pipe(gulp.dest(path.DEST_DEV));
});

gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'js/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST_PROD));
});

gulp.task('watch',['replaceHTMLsrc'], function() {
  gulp.watch(path.HTML, ['replaceHTMLsrc']);
  //gulp.watch(path.HTML, ['copy']);

  var watcher  = watchify(browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function () {
    watcher.bundle()
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_DEV + '/js'))
      console.log('Updated');
  })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_DEV+'/js'));
});

gulp.task('build', function(){
  browserify({
    entries: [path.ENTRY_POINT],
    transform: [reactify],
  })
    .bundle()
    .pipe(source(path.MINIFIED_OUT))
    .pipe(streamify(uglify({file: path.MINIFIED_OUT})))
    .pipe(gulp.dest(path.DEST_PROD +'/js'));
});



gulp.task('production', ['replaceHTML', 'build']);

gulp.task('default', ['watch' ]);
