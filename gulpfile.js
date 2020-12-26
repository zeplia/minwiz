var gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");

function defaultTask(cb) {
  gulp
    .src("src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"));

  cb();
}

exports.default = defaultTask;
