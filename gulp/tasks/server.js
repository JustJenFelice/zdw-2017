module.exports = function(config, gulp, browserSync, hygienist) {

  gulp.task('server', ['templates'], function() {
    return browserSync.init({
      server: {
        baseDir: config.dev.root,
        routes: {
          '/bower_components': './bower_components'
        },
        middleware: hygienist(config.dev.root)
      },
      notify: false
    });
  });

}
