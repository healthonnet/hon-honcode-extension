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
import download from 'gulp-download';
import decompress from 'gulp-decompress';
import mergeJson from 'gulp-merge-json';
import mergeStream from 'merge-stream';
import lazypipe from 'lazypipe';
import replace from 'gulp-replace';

const $ = gulpLoadPlugins();
const argv = require('yargs').argv;


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
  }).pipe(argv.firefox ? gulp.dest('distFirefox') : gulp.dest('dist'));
});

gulp.task('lint', () => {
  return gulp.src([
    'app/scripts/**/*.js',
    'test/**/*.js',
    '!app/scripts/utils/*.js',
    '!app/lib/**/*.js',
  ])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('jscs', () => {
  return gulp.src([
    'app/scripts/**/*.js',
    'test/**/*.js',
    '!app/scripts/utils/tld.js',
    '!app/lib/**/*.js',
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
    .pipe(
      argv.firefox ? gulp.dest('distFirefox/images') : gulp.dest('dist/images')
    );
});
gulp.task('styles', () => {
  const variables = {};
  variables.chromePrefix =
    argv.firefox ? '' : 'chrome-extension://__MSG_@@extension_id__';
  return gulp.src('app/styles.scss/*.scss')
    .pipe($.plumber())
    .pipe($.sassVars(variables))
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
    .pipe(argv.firefox ? gulp.dest('distFirefox') : gulp.dest('dist'));
});

gulp.task('chromeManifest', () => {
  const manifestPath =
    argv.firefox ? 'app/manifest.firefox.json' : 'app/manifest.json';
  return gulp.src(manifestPath)
  .pipe($.rename('manifest.json'))
  .pipe($.chromeManifest({
    background: {
      target: 'scripts/background.js',
    },
  }))
  .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
  .pipe($.if(/^(.{0,3}|.*(?!\.min).{4})\.js$/, $.sourcemaps.init()))
  .pipe($.if(/^(.{0,3}|.*(?!\.min).{4})\.js$/, $.uglify()))
  .pipe($.if(/^(.{0,3}|.*(?!\.min).{4})\.js$/, $.sourcemaps.write('.')))
  .pipe(argv.firefox ? gulp.dest('distFirefox') : gulp.dest('dist'));
});

gulp.task('locales', () => {
  return download('https://localise.biz:443/api/export/archive/json.zip?' +
    'key=dd5d1fa46f1ba7941659779f6423e38e&format=chrome')
    .pipe(decompress({strip: 1}))
    .pipe(argv.firefox ? gulp.dest('distFirefox') : gulp.dest('dist'));
});

var alterJson = lazypipe()
  .pipe(replace, /("\w\w"):("[^"]*")/g, '$1: { "message": $2 }');

gulp.task('lang-de', () => {
  return mergeStream(download(
    'https://github.com/umpirsky/country-list/raw/master/data/de/country.json'
  ).pipe(alterJson()), gulp.src('dist/_locales/de/messages.json'))
  .pipe(mergeJson('messages.json'))
  .pipe(gulp.dest('dist/_locales/de'));
});

gulp.task('lang-en', () => {
  return mergeStream(download(
    'https://github.com/umpirsky/country-list/raw/master/data/en/country.json'
  ).pipe(alterJson()), gulp.src('dist/_locales/en/messages.json'))
  .pipe(mergeJson('messages.json'))
  .pipe(gulp.dest('dist/_locales/en'));
});

gulp.task('lang-es', () => {
  return mergeStream(download(
    'https://github.com/umpirsky/country-list/raw/master/data/es/country.json'
  ).pipe(alterJson()), gulp.src('dist/_locales/es/messages.json'))
  .pipe(mergeJson('messages.json'))
  .pipe(gulp.dest('dist/_locales/es'));
});

gulp.task('lang-fr', () => {
  return mergeStream(download(
    'https://github.com/umpirsky/country-list/raw/master/data/fr/country.json'
  ).pipe(alterJson()), gulp.src('dist/_locales/fr/messages.json'))
  .pipe(mergeJson('messages.json'))
  .pipe(gulp.dest('dist/_locales/fr'));
});

gulp.task('lang-it', () => {
  return mergeStream(download(
    'https://github.com/umpirsky/country-list/raw/master/data/it/country.json'
  ).pipe(alterJson()), gulp.src('dist/_locales/it/messages.json'))
  .pipe(mergeJson('messages.json'))
  .pipe(gulp.dest('dist/_locales/it'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist', 'distFirefox']));

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

gulp.task('flags', () => {
  return gulp.src('app/lib/flag-css/dist/flags/*.svg')
    .pipe(gulp.dest('dist/flags'));
});

gulp.task('fonts', () => {
  return gulp.src('app/lib/font-awesome/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('package', () => {
  var manifest;
  if (argv.firefox) {
    manifest = require('./distFirefox/manifest.json');
    del.sync(['distFirefox/README.txt', 'distFirefox/**/*.map']);
    return gulp.src('distFirefox/**')
        .pipe($.zip('HONcode-Toolbar-v' + manifest.version + '-Firefox.zip'))
        .pipe(gulp.dest('package'));
  }
  manifest = require('./dist/manifest.json');
  del.sync(['dist/README.txt', 'dist/**/*.map']);
  return gulp.src('dist/**')
      .pipe($.zip('HONcode-Toolbar-v' + manifest.version + '-Chrome.zip'))
      .pipe(gulp.dest('package'));
});

gulp.task('test', () => {
  runSequence(['lint', 'jscs']);
  gulp.src('test/casper.js')
    .pipe(casperJs({command: 'test --web-security=no'}));
  // Run casperjs test
});

gulp.task('build', (cb) => {
  runSequence(
    ['html', 'images', 'extras'],
    'chromeManifest', 'flags', 'fonts',
    'lang', 'size', cb);
});

gulp.task('lang', ['locales'], (cb) => {
  runSequence(
    'lang-de',
    'lang-en',
    'lang-es',
    'lang-fr',
    'lang-it',
    cb
  );
});

gulp.task('chrome-prod', ['clean'], (cb) => {
  runSequence('build', 'package', cb);
});

gulp.task('default', ['clean'], cb => {
  runSequence('test', 'build', cb);
});
