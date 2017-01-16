module.exports = function(config, gulp, plugins, del) {

  // Delete the previous SVG build.
  gulp.task('svg:wipe', function() {
    return del(config.dev.svgBuildGlob);
  });

  // Optimize SVG.
  gulp.task('svg', ['svg:wipe'], function() {
    return gulp.src(config.dev.svgSourceGlob)
      .pipe(plugins.imagemin({
        svgoPlugins: [
          {removeViewBox: false}
        ]
      }))
      .pipe(gulp.dest(config.dev.svgBuild));
  });

}
