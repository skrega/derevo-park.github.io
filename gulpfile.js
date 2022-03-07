const {
  src,
  dest,
  watch,
  parallel,
  series
} = require('gulp');

const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const del = require('del');

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
}

function cleanDist() {
  return del('dist')
}

function images() {
  return src('app/images/**/*')
    .pipe(imagemin(
      [
        imagemin.gifsicle({
          interlaced: true
        }),
        imagemin.mozjpeg({
          quality: 75,
          progressive: true
        }),
        imagemin.optipng({
          optimizationLevel: 5
        }),
        imagemin.svgo({
          plugins: [{
              removeViewBox: true
            },
            {
              cleanupIDs: false
            }
          ]
        })
      ]
    ))
    .pipe(dest('dist/images'))
}

function minify() {
  return src('app/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'));
};

function scripts() {
  return src([
      'node_modules/jquery/dist/jquery.js',
      'node_modules/swiper/swiper-bundle.min.js',
      'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function styles() {
  return src('app/sass/style.sass')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function libsStyles() {
  return src([
      'node_modules/swiper/swiper-bundle.min.css',
    ])

    .pipe(concat('libs.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function build() {
  return src([
      'app/css/style.min.css',
      'app/fonts/**/*',
      'app/js/main.min.js',
      'app/*.html'
    ], {
      base: 'app'
    })
    .pipe(dest('dist'))
}

function watching() {
  watch(['app/sass/**/*.sass'], styles);
  watch(['app/css/**/*.css'], libsStyles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/*.html']).on('change', browserSync.reload);
}

exports.styles = styles;
exports.libsStyles = libsStyles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.minify = minify;
exports.images = images;
exports.cleanDist = cleanDist;


exports.build = series(cleanDist, images, libsStyles, minify, build);
exports.default = parallel(styles, scripts, libsStyles, browsersync, watching);