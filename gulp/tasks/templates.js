var
  gulp = require("gulp"),
  fs = require("fs"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "beepbeep", "browser-*"]
  }),
  config = require("../gulpconfig.json");

gulp.task("templates:compile", function() {
  return gulp.src([config.dev.pugGlob, config.dev.pugIgnore])
  
    .pipe(plugins.plumber(function (error) {
      plugins.beepbeep();
      console.log(error.message);
      this.emit("end");
    }))

    .pipe(plugins.data(function(file) {
      return JSON.parse(fs.readFileSync(config.dev.jsonGlobal))
    }))

    .pipe(plugins.pug({
      pretty: true,
      basedir: config.dev.root
    }))

    .pipe(plugins.rename(function (path) {
      path.extname = config.dev.pagesFormat;
    }))

    .pipe(gulp.dest(config.dev.root));
});

// Read paths to assets.
var resources;
gulp.task("templates:resources", function() {
  var readFile = fs.readFileSync(config.dev.resources, "utf8");
  resources = JSON.parse(readFile);
});

gulp.task("templates", ["templates:compile", "templates:resources"], function() {
  return gulp.src([config.dev.pagesGlob, config.dev.pagesIgnore])
    .pipe(plugins.inject(gulp.src(
      resources.injectDev.site, {read: false}), {
        relative: true,
        name: "site"
      }
    ))
    .pipe(gulp.dest(config.dev.root));
});
