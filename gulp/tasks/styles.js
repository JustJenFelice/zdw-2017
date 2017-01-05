var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "beepbeep", "browser-*"]
  }),
  config = require("../gulpconfig.json");

gulp.task("styles", function () {
  return gulp.src(config.dev.scssBase)

    .pipe(plugins.sassGlob())

    .pipe(plugins.sass({
      includePaths: require("node-neat").with("bower_components/")
    })

    .on("error", function (error) {
      plugins.beepbeep();
      plugins.sass.logError.bind(this)(error);
    }))

    .pipe(plugins.autoprefixer())

    .pipe(gulp.dest(config.dev.cssRoot))
    
    .pipe(plugins.browserSync.stream({
      match: "**/*.css"
    }));
});
