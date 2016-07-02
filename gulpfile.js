var gulp = require("gulp"),
    watch = require("gulp-watch"),
    compressor = require("node-minify"),
    htmlmin = require("gulp-minify-html"),
    minify = require("gulp-cssnano"),
    concat = require("gulp-concat"),
    merge = require("merge-stream"),
    clean = require("gulp-clean"),
    path = require("path"),
    minifyCss = require("gulp-minify-css");
    //less = require("gulp-less")

gulp.task("watch", function() {
    gulp.watch(["assets/index.html"], function() {
        gulp.start("index");
    });
    gulp.watch(["assets/modules/**/**/*.html"], function() {
        gulp.start("modules");
    });
    gulp.watch("assets/js/**/*.js", function() {
        gulp.start("js-vendors");
    });
    gulp.watch(["assets/modules/**/*.js"], function() {
        gulp.start("js-modules");
    });
    gulp.watch("assets/css/*.css", function() {
        gulp.start("css");
        gulp.start("css-login");
    });
    // gulp.watch("assets/css/less/main/*.css", function() {
    //     gulp.start("css");
    // });
});

gulp.task("index", function() {
    return gulp.src("assets/index.html")
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./public"));
});

gulp.task("modules", function() {
    return gulp.src(["assets/modules/**/**/*.html"])
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./public/assets/modules/"));
});

/*gulp.task("less", function () {
  return gulp.src(
        //[
        //"assets/css/less/main/main.less",
        //"assets/css/less/login.less",
        //"assets/css/less/vt-dashboard.less"])
    .pipe(less({
      paths: [ path.join(__dirname, "less", "includes") ]
    }))
    .pipe(gulp.dest("assets/lib/"));
});*/

gulp.task("css", function() {
      return gulp.src([
        "assets/css/angular-material.css",
        "assets/css/md-data-table.css",
        "assets/css/sweetalert.css",
        "assets/css/nv.d3.css",
        "assets/css/styles.css"
        ])
        .pipe(minifyCss())
        .pipe(concat("styles.min.css"))
        .pipe(gulp.dest("./public/assets/css/"));
});

gulp.task("css-login", function() {
      return gulp.src([
        "assets/css/login.css"
        ])
        .pipe(minifyCss())
        .pipe(concat("login.min.css"))
        .pipe(gulp.dest("./public/assets/css/"));
});

gulp.task("js-vendors", function() {
    new compressor.minify({
        type: "uglifyjs",
        fileIn: [
            "assets/js/vendor/angular.js",
            "assets/js/vendor/angular-animate.js",
            "assets/js/vendor/angular-aria.js",
            "assets/js/vendor/angular-messages.js",
            "assets/js/vendor/angular-ui-router.js",
            "assets/js/vendor/angular-sanitize.js",
            "assets/js/vendor/angular-resource.js",
            "assets/js/vendor/angular-local-storage-min.js",
            "assets/js/vendor/sweetalert.min.js",
            "assets/js/vendor/angular-material.js",
            "assets/js/vendor/md-data-table.js",
            "assets/js/vendor/d3.js",
            "assets/js/vendor/nv.d3.js",
            //"assets/js/vendor/angularjs-nvd3-directives.js",
            "assets/js/vendor/angular-nvd3.js",
            "assets/js/vendor/alasql.min.js",
            "assets/js/vendor/xlsx.core.min.js",
            "assets/js/vendor/moment.min.js",
            "assets/js/vendor/angular-timeago.js",
            //"assets/js/vendor/jquery-1.10.2.js",
            //"assets/js/vendor/jquery.signalR-2.1.2.js",
            // "assets/js/vendor/get-ip.js",

            "assets/js/vendor/videogular.js",
            "assets/js/vendor/vg-controls.js",
            "assets/js/vendor/vg-overlay-play.js",
            "assets/js/vendor/vg-poster.js",
            "assets/js/vendor/vg-buffering.js",
            
            "assets/js/app.js",
            "assets/js/routes.js",
            "assets/js/services.js",
            "assets/js/directives.js"
        ],
        fileOut: "./public/assets/js/vendors.min.js",
        callback: function(err, min) {
            if (err) {
                console.log(err);
            } else {
            }
        }
    });
});  

gulp.task("js-modules", function() {  
    new compressor.minify({
        type: "uglifyjs",
        fileIn: "assets/modules/**/*.js",
        fileOut: "./public/assets/js/modules.min.js",
        callback: function(err, min) {
            if (err) {
                console.log(err);
            } else {}
        }
    });
});

/* delete html css js folders */
gulp.task("clean", function() {
    return gulp.src([
            "public/assets/modules", 
            "public/assets/css", 
            "public/assets/js"
        ])
        .pipe(clean({
            force: true
        }));
});

gulp.task("default", [
	"index",
	"modules",
    "css",
	"css-login",
    "js-vendors",
	"js-modules",
    "watch"
]);
