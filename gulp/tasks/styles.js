module.exports = function(config, gulp, plugins, browserSync, emitty, beepbeep) {

  gulp.task('styles', function () {
    return gulp.src(config.dev.scssBase)

      .pipe(emittyScss.stream())

      .pipe(plugins.sassGlob())

      .pipe(plugins.sass({
        includePaths: require('node-neat').with('bower_components/')
      })

      .on('error', function (error) {
        beepbeep();
        plugins.sass.logError.bind(this)(error);
      }))

      .pipe(plugins.autoprefixer())

      .pipe(gulp.dest(config.dev.cssRoot))
      
      .pipe(browserSync.stream());
  });

}
