// Generated on 2016-02-09 using generator-chrome-extension 0.5.2
require('babel-core/register');

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import casperJs from 'gulp-casperjs';
import runSequence from 'run-sequence';
import {stream as wiredep} from 'wiredep';
import jscs from 'gulp-jscs';
import jshint from 'gulp-jshint';

const $ = gulpLoadPlugins();

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/_locales/**',
    '!app/*.json',
    '!app/*.html',
    '!app/styles.scss',
  ], {
    base: 'app',
    dot: true,
  }).pipe(gulp.dest('dist'));
});

gulp.task('lint', () => {
  return gulp.src([
    'app/scripts/**/*.js',
    'test/**/*.js',
    '!app/scripts/utils/*.js',
  ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('jscs', () => {
  return gulp.src([
    'app/scripts/**/*.js',
    'test/**/*.js',
    '!app/scripts/utils/tld.js',
  ])
    .pipe(jscs('.jscsrc'))
    .pipe(jscs.reporter());
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // Don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}],
    }))
    .on('error', function(err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});
gulp.task('styles', () => {
  return gulp.src('app/styles.scss/*.scss')
    .pipe($.plumber())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.'],
    }).on('error', $.sass.logError))
    .pipe(gulp.dest('app/styles'));
});

gulp.task('html', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.sourcemaps.init())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe($.sourcemaps.write())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('chromeManifest', () => {
  return gulp.src('app/manifest.json')
    .pipe($.chromeManifest({
      buildnumber: true,
      background: {
        target: 'scripts/background.js',
      },
    }))
  .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
  .pipe($.if('*.js', $.sourcemaps.init()))
  .pipe($.if('*.js', $.uglify()))
  .pipe($.if('*.js', $.sourcemaps.write('.')))
  .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', ['lint', 'html'], () => {
  $.livereload.listen();

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json',
  ]).on('change', $.livereload.reload);

  gulp.watch('app/scripts/**/*.js', ['lint']);
  gulp.watch('app/styles.scss/**/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('size', () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('package', function() {
  var manifest = require('./dist/manifest.json');
  return gulp.src('dist/**')
      .pipe($.zip('hon kconnect chrome extension-' + manifest.version + '.zip'))
      .pipe(gulp.dest('package'));
});

gulp.task('test', function() {
  runSequence(['lint', 'jscs']);
  gulp.src('test/casper.js')
    .pipe(casperJs({command: 'test --web-security=no'}));
  // Run casperjs test
});

gulp.task('build', (cb) => {
  runSequence(
    ['html', 'images', 'extras'],
    'jscs', 'lint', 'test', 'chromeManifest',
    'size', cb);
});

gulp.task('default', ['clean'], cb => {
  runSequence('build', cb);
});
