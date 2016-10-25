var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "beepbeep", "browser-*"]
  }),
  config = require("../gulpconfig.json");

gulp.task("styles", function () {
  return gulp.src(config.dev.scssBase)

    .pipe(plugins.plumber(function(error) {
      plugins.beepbeep();
      console.log(error);
      this.emit("end");
    }))

    .pipe(plugins.sassBulkImport())

    .pipe(plugins.sass({
      includePaths: require("node-neat").with("bower_components/")
    }))

    .pipe(gulp.dest(config.dev.cssRoot))
    
    .pipe(plugins.browserSync.stream());
});
