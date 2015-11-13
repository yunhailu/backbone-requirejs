var gulp = require('gulp');
//requirejs项目打包
var amdOptimize = require('amd-optimize');
//合并
var concat = require('gulp-concat');
//压缩js
var uglify = require('gulp-uglify');

gulp.task('rjs', function() {
	return	gulp.src('js/*.js')
		.pipe(amdOptimize('main',{
			name: "main",
			configFile: "js/main.js",
			baseUrl: 'js'
		}))
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});