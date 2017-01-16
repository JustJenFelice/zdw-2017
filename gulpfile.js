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

Tasks

*/
require('./gulp/tasks/server')(config, gulp, browserSync, hygienist);
require('./gulp/tasks/templates')(config, gulp, plugins, browserSync, emittyPug, beepbeep, fs);
require('./gulp/tasks/styles')(config, gulp, plugins, browserSync, emittyScss, beepbeep);
require('./gulp/tasks/build')(config, gulp, plugins, fs, del);
require('./gulp/tasks/svg')(config, gulp, plugins, del);
require('./gulp/tasks/test')(config, gulp, browserSync);

/*

Default

*/
gulp.task('default', ['server'], function() {
  gulp.watch([config.dev.pugGlob, config.dev.jsonGlob, config.dev.resources],
    ['templates']);
  gulp.watch(config.dev.scssGlob, ['styles']);
  gulp.watch(config.dev.jsGlob, browserSync.reload);
});
