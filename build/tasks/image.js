'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createImagemin = createImagemin;

exports.default = function (options, { gulp }) {
	gulp.task('default:image', function () {
		return new Promise(function (resolve, reject) {
			return setTimeout(function () {
				return gulp.src('src/{img,images}/**/*.{jpg,png,gif}').pipe((0, _gulpNewer2.default)('dist')).pipe((0, _gulpIf2.default)(({ path }) => !/\.min\.(jpg|png|gif)$/i.test(path), createImagemin())).pipe(gulp.dest('dist')).on('end', resolve).on('error', reject);
			}, 500);
		});
	});

	gulp.task('build:before:image', function () {
		return (0, _del2.default)(['dist/img/**', 'dist/images/**']);
	});

	gulp.task('dev:after:image', function () {
		gulp.watch('src/{img,images}/**/*.{jpg,png,gif}', ['default:image']);
	});
};

var _gulpImagemin = require('gulp-imagemin');

var _gulpImagemin2 = _interopRequireDefault(_gulpImagemin);

var _imageminPngquant = require('imagemin-pngquant');

var _imageminPngquant2 = _interopRequireDefault(_imageminPngquant);

var _imageminMozjpeg = require('imagemin-mozjpeg');

var _imageminMozjpeg2 = _interopRequireDefault(_imageminMozjpeg);

var _gulpIf = require('gulp-if');

var _gulpIf2 = _interopRequireDefault(_gulpIf);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _gulpNewer = require('gulp-newer');

var _gulpNewer2 = _interopRequireDefault(_gulpNewer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createImagemin() {
	return (0, _gulpImagemin2.default)({
		use: [(0, _imageminMozjpeg2.default)({ quality: 80 }), (0, _imageminPngquant2.default)()]
	});
}