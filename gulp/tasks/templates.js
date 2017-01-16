module.exports = function(config, gulp, plugins, browserSync, emitty, beepbeep, fs) {

  gulp.task('templates:compile', function() {
    return gulp.src(config.dev.pugGlob)

      .pipe(emitty.stream())

      .pipe(plugins.data(function(file) {
        return JSON.parse(fs.readFileSync(config.dev.jsonShared))
      }))

      .pipe(plugins.pug({
        pretty: true
      }))

      .on('error', function (error) {
        beepbeep();
        console.log(error.message);
        this.emit('end');
      })

      .pipe(plugins.filter(config.dev.pagesFilter))

      .pipe(plugins.rename(function (path) {
        path.extname = config.dev.pagesFormat;
      }))

      .pipe(gulp.dest(config.dev.pagesRoot));
  });

  // Read paths to assets.
  gulp.task('templates:resources', function() {
    var readFile = fs.readFileSync(config.dev.resources, 'utf8');
    return global.resources = JSON.parse(readFile);
  });

  gulp.task('templates:inject', ['templates:compile', 'templates:resources'], function() {
    return gulp.src(config.dev.pagesGlob, {base: '/' + config.dev.root})

      .pipe(plugins.cached('pages'))

      .pipe(plugins.rename(function (path) {
        path.dirname = path.dirname.replace(config.dev.pagesPartial, '.');
      }))

      .pipe(plugins.inject(gulp.src(
        global.resources.injectDev.site, {read: false}), {
          relative: true,
          name: 'site'
        }
      ))

      .pipe(gulp.dest('/' + config.dev.root));
  });

  gulp.task('templates', ['templates:inject'], function(done) {
    browserSync.reload();

    done();
  });
  
}
