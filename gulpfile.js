/* eslint-disable no-console */
const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const inlinesource = require("gulp-inline-source");
const path = require("path");
const del = require("del");

const html = () =>
  gulp
    .src("src/*.html")
    .pipe(inlinesource({ rootpath: path.resolve("dist") }))
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeOptionalTags: true,
        collapseBooleanAttributes: true,
      })
    )
    .pipe(gulp.dest("dist"));

const css = () =>
  gulp
    .src("src/styles/*.css")
    .pipe(
      cleanCSS({ debug: true, level: 2 }, (details) => {
        console.log(`${details.name}: ${details.stats.originalSize}`);
        console.log(`${details.name}: ${details.stats.minifiedSize}`);
      })
    )
    .pipe(gulp.dest("dist/styles"));

const purge = () => del(["dist/styles"]);

const assets = () => gulp.src("public/*").pipe(gulp.dest("dist"));

const dev = () =>
  gulp.watch(
    ["src/**/*"],
    { ignoreInitial: false },
    gulp.series(css, html, purge, assets)
  );

exports.html = html;
exports.css = css;
exports.dev = dev;
exports.default = gulp.series(css, html, purge, assets);
