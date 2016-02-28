var gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify');
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    del = require('del');
    webserver = require('gulp-webserver');

gulp.task('styles', function() {
  return gulp.src('app/css/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('compress', function() {
  gulp.src('app/scripts/*.js')
    .pipe(minify())
    .pipe(gulp.dest('dist/assets/scripts'))
});

gulp.task('scripts', function() {
  return gulp.src('app/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      optimizationLevel: 4
    }))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('templates', function() {
  return gulp.src('app/*.html')
        .pipe(gulp.dest('dist/'));
});


gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      open: true,
      livereload: true,
      directoryListing: {
        enable: false,
        path: 'dist'
      }
    }));
});

gulp.task('clean', function() {
    return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/images']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'images', 'templates', 'webserver');
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(['dist/**']).on('change', livereload.changed);
});
