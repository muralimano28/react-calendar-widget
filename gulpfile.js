"use strict";

var gulp = require('gulp'),
    reactify = require('reactify'),
    connect = require('gulp-connect'), //Runs a local dev server
    open = require('gulp-open'), //Open a URL in a web browser
    browserify = require('browserify'), // Bundles JS
    reactify = require('reactify'),  // Transforms React JSX to JS
	source = require('vinyl-source-stream'), // Use conventional text streams with Gulp
    concat = require('gulp-concat'), //Concatenates files
    lint = require('gulp-eslint'), //Lint JS files, including JSX
    streamify = require('gulp-streamify'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if');


var config = {
	port: 8000,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		jsx: [
            './src/**/*.jsx'
        ],
		css: [
            './src/styles/*.css'
    	],
        build: './build',
		dist: './dist',
		mainJs: './src/main.js',
		assets: './src/assets/**/*'
	}
};

// To run a local server.
gulp.task('connect', function() {
	connect.server({
		root: ['build'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function() {
	gulp.src('build/index.html')
		.pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function() {
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.build))
		.pipe(connect.reload());
});

gulp.task('jsx', function() {
	browserify(config.paths.mainJs, '!./src/assets')
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.build + '/scripts'))
		.pipe(connect.reload());
});

gulp.task('css', function() {
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.build + '/styles'))
        .pipe(connect.reload());
});

gulp.task('lint', function() {
	return gulp.src(config.paths.jsx)
		.pipe(lint({config: 'eslint.config.json'}))
		.pipe(lint.format());
});

var cssCondition = function(file) {
	var fileName = file['history'].toString();
	if (fileName.indexOf('.css') > 0) {
		return true;
	}
	return false;
}
var jsCondition = function(file) {
	var fileName = file['history'].toString();
	if (fileName.indexOf('.js') > 0) {
		return true;
	}
	return false;
}
gulp.task('assets', function() {
	gulp.src(config.paths.assets)
		.pipe(gulpif(cssCondition, streamify(minifyCss({
						"compatibility": "ie9"
				}))))
		.pipe(gulpif(jsCondition, streamify(uglify({
            "compress": true,
            "preserveComments": false
        }))))
		.pipe(gulp.dest(config.paths.build + '/public'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.jsx, ['js', 'lint']);
    gulp.watch(config.paths.css, ['css']);
	gulp.watch(config.paths.assests, ['assets']);
});

// This is for build process alone.

gulp.task('uglifiedJs', function() {
	gulp.src(config.paths.dist + '/scripts/bundle.js')
		.pipe(streamify(uglify({
            "compress": true,
            "preserveComments": false
        })))
		.on("error", console.error.bind(console))
		.pipe(gulp.dest(config.paths.dist + '/scripts'));
});

gulp.task('minifiedCss', function() {
	gulp.src(config.paths.dist + '/styles/bundle.css')
		.pipe(streamify(minifyCss({
            "compatibility": "ie9"
        })))
		.pipe(gulp.dest(config.paths.dist + '/styles'));
});

gulp.task('distAssets', function() {
    gulp.src(config.paths.build + '/public')
        .pipe(gulp.dest(config.paths.dist + '/public'));
});

gulp.task('default', ['html', 'js', 'css', 'lint', 'assets', 'open', 'watch']);
gulp.task('build', ['html', 'uglifiedJs', 'minifiedCss', 'distAssets']);
