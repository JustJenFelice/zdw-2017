var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["browser-*"]
  }),
  config = require("../gulpconfig.json");

gulp.task("watch", function() {
  gulp.watch(
    config.dev.scssGlob,
    ["styles"]
  );

  gulp.watch(
    [config.dev.pugGlob, config.dev.dataGlob, config.dev.resources],
    ["templates:reload"]
  );

  gulp.task("templates:reload", ["templates"], plugins.browserSync.reload)

  gulp.watch(config.dev.jsGlob, plugins.browserSync.reload);

});
