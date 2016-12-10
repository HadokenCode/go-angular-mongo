var gulp = require("gulp"),
    watch = require("gulp-watch"),
    compressor = require("node-minify"),
    htmlmin = require("gulp-minify-html"),
    minify = require("gulp-cssnano"),
    concat = require("gulp-concat"),
    merge = require("merge-stream"),
    clean = require("gulp-clean"),
    path = require("path"),
    minifyCss = require("gulp-minify-css"),
    gulpgo = require("gulp-go"),
    util = require("gulp-util"),
    notifier = require("node-notifier"),
    sync = require("gulp-sync")(gulp).sync,
    child = require("child_process"),
    os = require("os");

//less = require("gulp-less")

var server = null;

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
    gulp.watch("assets/css/less/main/*.css", function() {
        gulp.start("css");
    });
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
            } else {}
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

/*gulp.task("go-run", function() {
    go = gulpgo.run("main.go", ["--arg1", "value1"], { cwd: "./", stdio: 'inherit' });
});

gulp.task("go-restart", function() {
    go.restart();
});

gulp.task("gow", ["go-run"], function() {

    gulp.watch("./main.go").on("change", function() {
        gulp.start("go-restart");
    });

});*/

// Compile application
gulp.task('server:build', function() {

    // Build application in the "gobin" folder
    var build = child.spawnSync('go', ['install']);

    // Something wrong
    if (build.stderr.length) {
        util.log(util.colors.red('Something wrong with this version :'));
        var lines = build.stderr.toString()
            .split('\n').filter(function(line) {
                return line.length
            });
        for (var l in lines)
            util.log(util.colors.red(
                'Error (go install): ' + lines[l]
            ));
        notifier.notify({
            title: 'Error (go install)',
            message: lines
        });
    }

    console.log("serving port:7324");
    return build;
});

// Launch server
gulp.task('server:spawn', function() {
    // Stop the server
    if (server && server !== 'null') {
        server.kill();
    }
    // Application name
    if (os.platform() == 'win32') {
        // Windows
        var path_folder = __dirname.split('\\');
        //console.log(path_folder);
    } else {
        // Linux / MacOS
        var path_folder = __dirname.split('/');
    }
    var length = path_folder.length;
    var app = path_folder[length - parseInt(1)];
    // Run the server
    if (os.platform() == 'win32') {
        //console.log(process.env);
        var env = process.env;
        //console.log(env.GOBIN + '\\' + app + '.exe');
        server = child.spawn(env.GOBIN + '\\' + app + '.exe');
    } else {
        server = child.spawn(app);
    }
    // Display terminal informations
    server.stderr.on('data', function(data) {
        process.stdout.write(data.toString());
    });
});

// Watch files
gulp.task('server:watch', function() {
    //livereload.listen({ basePath: './' });
    gulp.watch([
        '*.go',
        '**/*.go',
    ], sync([
        'server:build',
        'server:spawn'
    ], 'server'));
});

gulp.task('default', ['server:build', 'server:spawn', 'server:watch']);

gulp.task("build", [
    "index",
    "modules",
    "css",
    "css-login",
    "js-vendors",
    "js-modules",
    "watch"
]);
