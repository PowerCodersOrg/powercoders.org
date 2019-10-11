const { series, src, dest, watch } = require('gulp');
import cp from "child_process";
import gutil from "gulp-util";
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import postcssPresetEnv from "postcss-preset-env";
import pleeease from "gulp-pleeease";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import svgstore from "gulp-svgstore";
import svgmin from "gulp-svgmin";
import inject from "gulp-inject";
import cssnano from "cssnano";

import imagemin from "gulp-imagemin";

const browserSync = BrowserSync.create();
const hugoBin = `./bin/hugo.${process.platform === "win32" ? "exe" : process.platform}`;
const defaultArgs = ["-d", "../dist", "-s", "site"];

if (process.env.DEBUG) {
  defaultArgs.unshift("--debug");
}

function hugo(cb) {
  buildSite(cb);
}

exports.hugo = hugo;

function hugo_preview(cb) {
  buildSite(cb, ["--buildDrafts", "--buildFuture"]);
}

exports.hugo_preview = hugo_preview;

exports.build = series(css, js, hugo);
exports.build_preview = series(css, js, hugo_preview);

function css(cb) {
  src("./src/css/*.css")
    .pipe(postcss([cssImport({ from: "./src/css/main.css" })]))
    .pipe(pleeease())  // Supports drop-shadow filter on SVG elements
    .pipe(postcss([
      postcssPresetEnv({stage: 0}),
      cssnano(),
    ]))
    .pipe(dest("./dist/css"))
    .pipe(browserSync.stream());
  cb();
}
exports.css = css;

function js(cb) {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
}
exports.js = js;

function img(cb) {
  return src("site/static/img/*")
    .pipe(imagemin())
    .pipe(dest("./dist/img"))
    .pipe(browserSync.stream());
}
exports.img = img;

function svg() {
  const svgs = src("site/static/img/icons-*.svg")
	.pipe(svgmin())
	.pipe(svgstore({inlineSvg: true}));

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return src("site/layouts/partials/svg.html", {allowEmpty: true})
    .pipe(inject(svgs, {transform: fileContents}))
    .pipe(dest("site/layouts/partials/"));
};
exports.svg = svg;

function server(cb) {
  series(hugo, css, js, svg, img);
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  watch("./src/js/**/*.js", js);
  watch("./src/css/**/*.css", css);
  watch("./site/static/img/icons-*.svg", svg);
  watch("./site/static/img/**/*", img);
  watch("./site/**/*", hugo);
  cb();
}
exports.server = series(hugo, css, js, svg, img, server);


function buildSite(cb, options) {
  const args = options ? defaultArgs.concat(options) : defaultArgs;

  return cp.spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload("notify:false");
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}
