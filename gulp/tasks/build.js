module.exports = function(config, gulp, plugins, fs, del) {

  // Delete the previous build.
  gulp.task('build:wipe', function() {
    return del(config.dist.root);
  });

  // Read paths to assets.
  var resources;
  gulp.task('build:resources', function() {
    var readFile = fs.readFileSync(config.dev.resources, 'utf8');
    resources = JSON.parse(readFile);
  });

  // Move other assets to production folder.
  gulp.task('build:move', ['build:wipe', 'build:resources'], function() {
    return gulp.src(resources.move.relative, {base: config.dev.root})
      .pipe(gulp.dest(config.dist.root));
  });

  // Move other assets to production folder.
  gulp.task('build:static', ['build:wipe', 'build:resources'], function() {
    return gulp.src(resources.move.static)
      .pipe(gulp.dest(config.dist.root));
  });

  // Clean CSS and JS.
  gulp.task('build:compile', ['build:move', 'build:static'], function() {
    return gulp.src(config.dev.root + 'index.html')
      .pipe(plugins.usemin(
        {
          js: [plugins.uglify()],
          css: [
            plugins.cleanCss({
              keepSpecialComments: 0
          })]
        }
      ))
      .pipe(gulp.dest(config.dist.root));
  });

  // Inject production assets into all pages.
  gulp.task('build:inject', ['build:compile'], function() {
    return gulp.src(config.dist.root + '**/*.html')
      .pipe(plugins.inject(gulp.src(
          resources.injectDist.site, {read: false}), {
            relative: true,
            name: 'site'
          }
        ))
      .pipe(gulp.dest(config.dist.root));
  });

  // Minify images.
  gulp.task('build:images', ['build:wipe'], function() {
    return gulp.src([config.dev.imagesGlob, config.dev.imagesIgnore], {base: config.dev.root})
      .pipe(plugins.imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
      }))
      .pipe(gulp.dest(config.dist.root));
  });

  // Wipe first. Move, produce, along with images.
  gulp.task('build', ['build:inject', 'build:images']);
}
