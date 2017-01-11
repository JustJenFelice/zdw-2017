const
  config = require('./gulp/gulpconfig.json'),
  gulp = require('gulp'),
  fs = require('fs'),
  del = require('del'),
  browserSync = require('browser-sync').create(),
  hygienist = require('hygienist-middleware'),
  beepbeep = require('beepbeep'),
  plugins = require('gulp-load-plugins')(),
  emittyPug = require('emitty').setup(config.dev.pugRoot, 'pug'),
  emittyScss = require('emitty').setup(config.dev.scssRoot, 'scss');

/*

Run a server for HTML files

*/
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

/*

Templates

*/
gulp.task('templates:compile', function() {
  return gulp.src(config.dev.pugGlob)

    .pipe(emittyPug.stream())

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

/*

Styles

*/
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

    .pipe(gulp.dest(config.dev.cssRoot))
    
    .pipe(browserSync.stream());
});

/*

Build

*/
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
  gulp.src(resources.move.relative, {base: config.dev.root})
    .pipe(gulp.dest(config.dist.root));

  return gulp.src(resources.move.static)
    .pipe(gulp.dest(config.dist.root));
});

// Clean CSS and JS.
gulp.task('build:compile', ['build:move'], function() {
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

/*

Test production version

*/
gulp.task('test', function() {
  return browserSync.init({
    server: {
      baseDir: config.dist.root
    },
    notify: false
  });
});

/*

SVG

*/
// Delete the previous SVG build.
gulp.task('svg:wipe', function() {
  return del(config.dev.svgBuildGlob);
});

// Optimize SVG.
gulp.task('svg:minify', ['svg:wipe'], function() {
  return gulp.src(config.dev.svgSourceGlob)
    .pipe(plugins.imagemin({
      svgoPlugins: [
        {removeViewBox: false}
      ]
    }))
    .pipe(gulp.dest(config.dev.svgBuild));
});

gulp.task('svg', ['svg:minify']);

/*

Tasks

*/
gulp.task('default', ['server'], function() {
  gulp.watch([config.dev.pugGlob, config.dev.jsonGlob, config.dev.resources],
    ['templates']);
  gulp.watch(config.dev.scssGlob, ['styles']);
  gulp.watch(config.dev.jsGlob, browserSync.reload);
});

// Wipe first. Move, produce, along with images.
gulp.task('build', ['build:inject', 'build:images']);
