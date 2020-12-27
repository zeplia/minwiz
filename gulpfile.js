const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const inlinesource = require("gulp-inline-source");
const path = require("path");
const del = require("del");
const rename = require("gulp-rename");

const html = () => {
  return gulp
    .src("src/*.html")
    .pipe(inlinesource({ rootpath: path.resolve("dist") }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"));
};

const css = () => {
  return gulp
    .src("src/styles/*.css")
    .pipe(
      cleanCSS({ debug: true }, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(gulp.dest("dist/styles"));
};

const purgeCss = () => {
  return del(["dist/styles/**"]);
};

const favIcon = () => {
  return gulp
    .src("design/tinypng.png")
    .pipe(rename("favicon.ico"))
    .pipe(gulp.dest("dist"));
};

const dev = () => {
  return gulp.watch(["src/**/*"], gulp.series(css, html, purgeCss, favIcon));
};

exports.html = html;
exports.css = css;
exports.dev = dev;
exports.default = gulp.series(css, html, purgeCss, favIcon);
