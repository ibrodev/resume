const gulp = require("gulp");
const sass = require("gulp-sass");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();

sass.compiler = require("node-sass");

const options = {
  scss: {
    src: "./src/scss/**/*scss",
    dist: "./dist/css",
  },
  views: {
    src: "./src/views/**/[^_]*.pug",
    watch: "./src/views/**/*.pug",
    dist: "./dist",
  },
};

const serve = () => {
  browserSync.init({
    server: {
      baseDir: "./dist/",
    },
  });
};

const stylesheet = () => {
  const { src, dist } = options.scss;
  return gulp
    .src(src)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
};

const view = () => {
  const { src, dist } = options.views;
  return gulp.src(src).pipe(pug()).pipe(gulp.dest(dist));
};

const watch = () => {
  const { scss, views } = options;
  gulp.watch(scss.src, stylesheet);
  gulp.watch(views.watch, view).on("change", browserSync.reload);
};

exports.stylesheet = stylesheet;
exports.view = view;
exports.watch = watch;

exports.default = gulp.series(
  gulp.parallel(stylesheet, view),
  gulp.parallel(watch, serve)
);
