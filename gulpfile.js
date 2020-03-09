
const { src, dest, series } = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sourceMaps = require('gulp-sourcemaps');
const uglifyJs = require('gulp-uglify');

function chartist(){
  return src(['script/src/chartist.js', 'script/src/chartist-*.js'])
  .pipe(sourceMaps.init())
  .pipe(concat('vendor.js'))
  .pipe(uglifyJs())
  .pipe(sourceMaps.write('.'))
  .pipe(dest('script/dist'))
}
function wet(){
  return src(['script/src/wet-boew.js'])
  .pipe(sourceMaps.init())
  .pipe(uglifyJs())
  .pipe(sourceMaps.write('.'))
  .pipe(dest('script/dist'))
}
function plugins(){
  return src(['script/src/details.js'])
  .pipe(sourceMaps.init())
  .pipe(uglifyJs())
  .pipe(sourceMaps.write('.'))
  .pipe(dest('script/dist'))
}
function js(){
  return src(
    ['script/src/pmo.js', 'script/src/search.js']
  )
  .pipe(sourceMaps.init())
  .pipe(babel())
  .pipe(concat('bundle.js'))
  .pipe(uglifyJs())
  .pipe(sourceMaps.write('.'))
  .pipe(dest('script/dist/'));
}

exports.vendor = series(chartist, wet, plugins);
exports.default = js;
