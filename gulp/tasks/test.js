module.exports = function(config, gulp, browserSync) {

  gulp.task('test', function() {
    return browserSync.init({
      server: {
        baseDir: config.dist.root
      },
      notify: false
    });
  });

}
