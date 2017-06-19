require('babel-core/register');

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import casperJs from 'gulp-casperjs';
import runSequence from 'run-sequence';
import {stream as wiredep} from 'wiredep';
import lazypipe from 'lazypipe';
import {argv} from 'yargs';

const $ = gulpLoadPlugins();

/* Define destination directory */
let dest = 'dist/chrome';
if (argv.firefox) {
  dest = 'dist/firefox';
}

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
  }).pipe(gulp.dest(dest));
});

gulp.task('lint', () => {
  return gulp.src([
    'app/scripts/**/*.js',
    'test/**/*.js',
    '!app/scripts/utils/*.js',
    '!app/lib/**/*.js',
  ])
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('default'));
});

gulp.task('jscs', () => {
  return gulp.src([
    'app/scripts/**/*.js',
    'test/**/*.js',
    '!app/scripts/utils/tld.js',
    '!app/lib/**/*.js',
  ])
    .pipe($.jscs('.jscsrc'))
    .pipe($.jscs.reporter());
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
    .pipe(gulp.dest(dest + '/images'));
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

  return gulp.src('app/*.html')
    .pipe($.sourcemaps.init())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe($.sourcemaps.write())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest(dest));
});

gulp.task('manifest', () => {
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
  .pipe(gulp.dest(dest));
});

gulp.task('locales', () => {
  return $.download('https://localise.biz:443/api/export/archive/json.zip?' +
    'key=dd5d1fa46f1ba7941659779f6423e38e&format=chrome')
    .pipe($.decompress({strip: 1}))
    .pipe(gulp.dest(dest));
});

var alterJson = lazypipe()
  .pipe($.replace, /("\w\w"):("[^"]*")/g, '$1: { "message": $2 }')
  .pipe($.mergeJson, {
    fileName: 'messages.json',
  });

gulp.task('lang-de', () => {
  return gulp.src([
      './app/lib/country-code/data/de/country.json',
      dest + '/_locales/de/messages.json',
    ])
    .pipe(alterJson())
    .pipe(gulp.dest(dest + '/_locales/de'));
});

gulp.task('lang-en', () => {
  return gulp.src([
      './app/lib/country-code/data/en/country.json',
      dest + '/_locales/en/messages.json',
    ])
    .pipe(alterJson())
    .pipe(gulp.dest(dest + '/_locales/en'));
});

gulp.task('lang-es', () => {
  return gulp.src([
      './app/lib/country-code/data/es/country.json',
      dest + '/_locales/es/messages.json',
    ])
    .pipe(alterJson())
    .pipe(gulp.dest(dest + '/_locales/es'));
});

gulp.task('lang-fr', () => {
  return gulp.src([
      './app/lib/country-code/data/fr/country.json',
      dest + '/_locales/fr/messages.json',
    ])
    .pipe(alterJson())
    .pipe(gulp.dest(dest + '/_locales/fr'));
});

gulp.task('lang-it', () => {
  return gulp.src([
      './app/lib/country-code/data/it/country.json',
      dest + '/_locales/it/messages.json',
    ])
    .pipe(alterJson())
    .pipe(gulp.dest(dest + '/_locales/it'));
});

gulp.task('clean', del.bind(null, ['.tmp', dest]));

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
  return gulp.src(dest + '/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('flags', () => {
  return gulp.src('app/lib/flag-css/dist/flags/*.svg')
    .pipe(gulp.dest(dest + '/flags'));
});

gulp.task('fonts', () => {
  return gulp.src('app/lib/font-awesome/fonts/*')
    .pipe(gulp.dest(dest + '/fonts'));
});

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
    }))
    .pipe(gulp.dest('app'));
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

gulp.task('package', ['build'], () => {
  var browser = 'Chrome';
  if (argv.firefox) {
    browser = 'Firefox';
  }
  var manifest = require('./' + dest + '/manifest.json');
  del.sync([dest + '/README.txt', dest + '/**/*.map']);
  return gulp.src(dest + '/**')
      .pipe($.zip('HONcode-Toolbar-v' + manifest.version + '-' +
        browser + '.zip'))
      .pipe(gulp.dest('package'));
});

gulp.task('test', ['lint', 'jscs'], () => {
  gulp.src('test/casper.js')
    .pipe(casperJs({command: 'test --web-security=no'}));
});

gulp.task('build', (cb) => {
  runSequence(
    'test', ['html', 'images', 'extras'],
    'manifest', 'flags', 'fonts',
    'lang', 'size', cb);
});

gulp.task('default', ['clean'], cb => {
  runSequence('test', 'build', cb);
});
