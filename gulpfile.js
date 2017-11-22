var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  browserSync = require('browser-sync'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  gcmq = require('gulp-group-css-media-queries'),
  autoprefixer = require('autoprefixer'),
  htmlmin = require('gulp-htmlmin'),
  imagemin = require('gulp-imagemin'),
  spritesmith = require('gulp.spritesmith'),
  base64 = require('gulp-base64-inline'),
  fileinclude = require('gulp-file-include'),
  postcss = require('gulp-postcss'),
  csso = require('postcss-csso');

var workDir = './';

var path = {
  app: {
    js: workDir + 'app/js/**/*.js',
    style: workDir + 'app/stylus/*.styl',
    img: workDir + 'app/img/img/*.*',
    imgSprite: workDir + 'app/img/sprite/*.*',
    html: workDir + 'app/html/*.html'
  },
  dist: {
    js: workDir + 'dist/js/',
    css: workDir + 'dist/css/',
    img: workDir + 'dist/img/',
    html: workDir + 'dist/'
  },
  watch: {
    js: workDir + 'app/js/**/*.js',
    style: workDir + 'app/stylus/**/*.styl',
    img: workDir + 'app/img/**/*.*',
    html: workDir + 'app/html/**/*.html'
  }
};

gulp.task('html', function () {
  gulp.src(path.app.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
//    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('css', function () {
  var plugins = [
    autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
    }),
    csso
  ];
  return gulp.src(path.app.style)
    .pipe(stylus())
    .pipe(gcmq())
    .pipe(base64('../../app/img/base64'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('css-vendors', function () {
  var plugins = [
    csso
  ];
  return gulp.src([
    'node_modules/normalize.css/normalize.css'
  ])
    .pipe(postcss(plugins))
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('img', function () {
  return gulp.src(path.app.img)
    .pipe(imagemin())
    .pipe(gulp.dest(path.dist.img))
});

gulp.task('sprite', function() {
  var spriteData = gulp.src(path.app.imgSprite) // путь, откуда берем картинки для спрайта
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      algorithm: 'binary-tree',
      padding: 20
    }));

    spriteData.img.pipe(gulp.dest('app/img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('app/')); // путь, куда сохраняем стили
});

gulp.task('js', function () {
  return gulp.src([
    'app/js/app.js'
  ])
    .pipe(uglify())
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('js-vendors', function () {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js'
  ])
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist.js))
});

gulp.task('sync', function () {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    notify: false
  });
});

gulp.task('watch', ['sync', 'css-vendors', 'css', 'html', 'js-vendors', 'js', 'img'], function () {
  gulp.watch(path.watch.style, ['css']);
  gulp.watch(path.watch.html, ['html']);
  gulp.watch(path.watch.js, ['js']);
});
