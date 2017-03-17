'use strict';

import browserSync from 'browser-sync';

export default function({ port }, { gulp, TaskListener }) {

	const bsPort = port
		? 'number' === typeof port ? port : Math.floor(9999 * Math.random())
		: false;

	gulp.task('dev:after:browser', function() {
		const bs = browserSync.create();

		return new Promise(function(resolve) {
			const config = {
				server: {
					baseDir: 'dist',
					directory: true,
					middleware(req, res, next) {
						res.setHeader('Access-Control-Allow-Origin', '*');
						next();
					}
				},
				open: 'external',
				ghostMode: false
			};
			if(bsPort) {
				config.port = bsPort;
			}
			return bs.init(config, resolve);
		}).then(function() {
			TaskListener.subscribe('end', bs.reload);
		});
	});

}