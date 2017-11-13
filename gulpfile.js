var gulp = require('gulp'),
  stylus = require('gulp-stylus'),
  browserSync = require('browser-sync'),
  rigger = require('gulp-rigger'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cleanCss = require('gulp-clean-css'),
  gcmq = require('gulp-group-css-media-queries'),
  autoprefixer = require('gulp-autoprefixer'),
  htmlmin = require('gulp-htmlmin'),
  imagemin = require('gulp-imagemin'),
  spritesmith = require('gulp.spritesmith');

var workDir = './';

var path = {
  app: {
    js: workDir + 'app/js/**/*.js',
    style: workDir + 'app/stylus/*.styl',
    img: workDir + 'app/img/**/*.*',
    imgSprite: workDir + 'app/img/icon/*.*',
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
    .pipe(rigger())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('css', function () {
  return gulp.src(path.app.style)
    .pipe(stylus())
    .pipe(gcmq())
    .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
    }))
    .pipe(cleanCss())
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
    var spriteData = 
        gulp.src(path.app.imgSprite) // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
                algorithm: 'binary-tree',
				padding: 5,
                cssVarMap: function(sprite) {
                    sprite.name = sprite.name
                }
            }));

    spriteData.img.pipe(gulp.dest('app/')); // путь, куда сохраняем картинку
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

gulp.task('js-libs', function () {
  return gulp.src([
    'app/js/libs/jquery/dist/jquery.min.js'
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

gulp.task('watch', ['sync', 'css', 'html', 'js-libs', 'js', 'img'], function () {
  gulp.watch(path.watch.style, ['css']);
  gulp.watch(path.watch.html, ['html']);
  gulp.watch(path.watch.js, ['js']);
});
