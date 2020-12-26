var gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");

function html(cb) {
  gulp
    .src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"));

  cb();
}

function css(cb) {
  gulp
    .src("src/styles/*.css")
    .pipe(
      cleanCSS({ debug: true }, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(gulp.dest("dist"));
  cb();
}

const defaultTasks = gulp.parallel(html, css);

exports.default = defaultTasks;
