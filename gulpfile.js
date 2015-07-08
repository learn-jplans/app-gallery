"use strict";

var elixir = require('laravel-elixir');
var gulp = require("gulp");
var gulpUtil = require("gulp-util");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");

var compass = require("gulp-compass");
var sass = require('gulp-sass');

gulp.task("default", function() {
    gulp.start("styles", "scripts");
});


gulp.task("watch", function() {
    gulp.watch("resources/assets/sass/**/*.scss", ["styles"]);
    gulp.watch("resources/assets/js/**/*.js", ["scripts"]);
});


gulp.task("styles", function() {
    gulp.src("resources/assets/sass/*.scss")
        .pipe(compass({
            config_file: "./config/config.rb",
            sass: "resources/assets/sass",
            css: "public/assets/css"
        }))
        .pipe(gulp.dest("public/assets/css"))
        .pipe(concat('app.css'))
        .pipe(gulp.dest("public/assets/css"))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(rename('app.min.css'))
    	.pipe(gulp.dest("public/assets/css"));
});


gulp.task("scripts", function() {
    gulp.src([
	        "resources/assets/js/*.js",
	        "resources/assets/js/components/**/*.js"
	    ])
	    .pipe(concat("app.js"))
    	.pipe(gulp.dest("public/assets/js"))
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("public/assets/js"));
});
