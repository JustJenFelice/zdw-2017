const
  config = require('./gulp/gulpconfig.json'),
  gulp = require('gulp'),
  fs = require('fs'),
  browserSync = require('browser-sync').create(),
  hygienist = require('hygienist-middleware'),
  beepbeep = require('beepbeep'),
  plugins = require('gulp-load-plugins')(),
  emittyPug = require('emitty').setup('app/assets/pug', 'pug'),
  emittyScss = require('emitty').setup('app/assets/scss', 'scss');

// Run a server for HTML files
gulp.task('server', function() {
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

gulp.task('templates:compile', function() {
  return gulp.src('app/assets/pug/**/!(_)*.pug')

    .pipe(emittyPug.stream())

    .pipe(plugins.data(function(file) {
      return JSON.parse(fs.readFileSync(config.dev.jsonGlobal))
    }))

    .pipe(plugins.pug({
      pretty: true
    }))

    .on('error', function (error) {
      beepbeep();
      console.log(error.message);
      this.emit('end');
    })

    .pipe(plugins.rename(function (path) {
      path.extname = config.dev.pagesFormat;
    }))

    .pipe(gulp.dest("app/assets/html/"));
});

// Read paths to assets.
gulp.task('templates:resources', function() {
  var readFile = fs.readFileSync(config.dev.resources, 'utf8');
  return global.resources = JSON.parse(readFile);
});

gulp.task('templates:inject', ['templates:compile', 'templates:resources'], function() {
  return gulp.src('app/assets/html/**/*.html')

    // Need to fix paths
    .pipe(plugins.inject(gulp.src(
      global.resources.injectDev.site, {read: false}), {
        relative: true,
        name: 'site'
      }
    ))

    .pipe(gulp.dest('app/assets/html/'));
});

gulp.task('templates', ['templates:inject'], function(done) {
  browserSync.reload();

  done();
});

gulp.task('styles', function () {
  return gulp.src('app/assets/scss/!(_)*.scss')

    .pipe(emittyScss.stream())

    .pipe(plugins.sassGlob())

    .pipe(plugins.sass({
      includePaths: require('node-neat').with('bower_components/')
    })

    .on('error', function (error) {
      beepbeep();
      plugins.sass.logError.bind(this)(error);
    }))

    .pipe(gulp.dest(config.dev.cssRoot))
    
    .pipe(browserSync.stream());
});

gulp.task('default', ['server'], function() {
  gulp.watch(['app/assets/pug/**/*.pug', 'app/assets/data/*.json'], ['templates']);
  gulp.watch('app/assets/scss/**/*.scss', ['styles']);
  gulp.watch('app/assets/js/**/*.js', browserSync.reload);
});
