'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (gulp, options, _ref) {
	var browser = _ref.browser,
	    isBuild = _ref.isBuild;


	var tplSetting = getTplSetting(options);
	var insertIconfont = Boolean(options.insertIconfont);

	gulp.task('default:html', function () {
		var glob = ['src/**/*.html', '!src/**/_*.html', '!src/{asset,template}/**/*.html'];
		var stream = gulp.src(glob).pipe((0, _gulpHtmlTpl2.default)(tplSetting));
		if (insertIconfont && isUsingIconfont()) {
			stream = stream.pipe((0, _gulpPosthtml2.default)([insertEntityToHTML()]));
		}
		return stream.pipe(gulp.dest('dist')).on('end', browser.reload);
	});

	if (!isBuild) {
		gulp.watch(['src/**/*.html', '!src/asset/**/*.html'], ['default:html']);
		if (insertIconfont) {
			gulp.watch('src/css/_iconfont.scss', ['default:html']);
		}
	}
};

var _gulpHtmlTpl = require('gulp-html-tpl');

var _gulpHtmlTpl2 = _interopRequireDefault(_gulpHtmlTpl);

var _juicer = require('juicer');

var _juicer2 = _interopRequireDefault(_juicer);

var _gulpPosthtml = require('gulp-posthtml');

var _gulpPosthtml2 = _interopRequireDefault(_gulpPosthtml);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_juicer2.default.set('strip', false);

var iconfontScssPath = process.cwd() + '/src/css/_iconfont.scss';

var isUsingIconfont = function isUsingIconfont() {
	try {
		var isDirectory = _fs2.default.lstatSync(process.cwd() + '/src/asset/iconfont').isDirectory();
		var isFile = _fs2.default.lstatSync(iconfontScssPath).isFile();
		return isDirectory && isFile;
	} catch (e) {
		return false;
	}
};

function insertEntityToHTML() {

	var icons = {};

	try {
		_fs2.default.readFileSync(iconfontScssPath).toString().match(/\$__iconfont__data([\s\S]*?)\);/)[1].replace(/"([^"]+)":\s"([^"]+)",/g, function (_, name, entity) {
			Object.defineProperty(icons, name.toLowerCase(), {
				enumerable: true,
				value: entity.slice(1).toLowerCase()
			});
		});
	} catch (e) {}

	return function (tree) {
		tree.match({ tag: 'i' }, function (node) {
			var attrs = node.attrs;
			if (attrs) {
				var classText = attrs.class;
				var exec = /\b_i-([\w-]+)/.exec(classText);
				if (exec) {
					var name = exec[1].toLowerCase();
					if (icons.hasOwnProperty(name)) {
						node.attrs.class = classText.replace(exec[0], '').replace(/\s+/g, ' ').trim();
						node.content = ['&#x' + icons[name] + ';'];
					}
				}
			}
			return node;
		});
		return tree;
	};
}

function getTplSetting(options) {

	var defaultOption = {
		engine: _juicer2.default,
		data: { Math: Math, Number: Number, Boolean: Boolean, String: String, Array: Array, Object: Object }
	};

	return Object.assign(defaultOption, options['gulp-html-tpl.html'] || options['gulp-html-tpl']);
}