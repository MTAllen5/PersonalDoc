const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');



gulp.task('BABEL', function () {
	// Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
	var _babel = () => {
		gulp.src('./dev_js/all.js')
			.pipe(babel({
				presets: ['es2015']
			}))
			.pipe(gulp.dest('js'))

		var d = new Date();
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		var t = (h<10?'0'+h:h) + ':' + (m<10?'0'+m:m) + ':' + (m<10?'0'+m:m);
		console.log('Complete! ' + t)
	}
	_babel();
	return watch('./dev_js/all.js', function () {
		_babel()
	});
});
