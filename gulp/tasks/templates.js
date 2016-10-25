var
  gulp = require("gulp"),
  fs = require("fs"),
  plugins = require("gulp-load-plugins")({
    pattern: ["glob", "gulp-*", "beepbeep", "browser-*"]
  }),
  config = require("../gulpconfig.json");

// Parse JSON locals.
var jsonOutput;
gulp.task("templates:read", function() {
  var jsonFiles = plugins.glob.sync(config.dev.dataGlob);

  // Check if files exist.
  if (jsonFiles.length > 0) {

    jsonOutput = fs.readFileSync(jsonFiles[0], "utf8");

    // Add other files if more than one.
    if (jsonFiles.length > 1) {
      // Slicing always last two chars because of newline!
      jsonOutput = jsonOutput.slice(0, -2);

      for (i = 1; i < jsonFiles.length; i++) {
        // Remove wrapping brackets.
        var slicedFile = fs.readFileSync(jsonFiles[i], "utf8").slice(1, -2);
        jsonOutput += ",\n" + slicedFile;
      }

      jsonOutput += "}";
    }

  } else {
    jsonOutput = null;
  }
});

gulp.task("templates:compile", ["templates:read"], function() {
  return gulp.src([config.dev.pugGlob, config.dev.pugIgnore])
  
    .pipe(plugins.plumber(function (error) {
      plugins.beepbeep();
      console.log(error);
      this.emit("end");
    }))

    .pipe(plugins.pug({
      pretty: true,
      locals: JSON.parse(jsonOutput),
      basedir: config.dev.root
    }))

    .pipe(plugins.rename(function (path) {
      path.extname = config.dev.pagesFormat;
    }))

    .pipe(gulp.dest(config.dev.root));
});

// Read paths to assets.
var resources;
gulp.task("templates:resources", function() {
  var readFile = fs.readFileSync(config.dev.resources, "utf8");
  resources = JSON.parse(readFile);
});

gulp.task("templates", ["templates:compile", "templates:resources"], function() {
  return gulp.src([config.dev.pagesGlob, config.dev.pagesIgnore])
    .pipe(plugins.inject(gulp.src(
      resources.injectDev.site, {read: false}), {
        relative: true,
        name: "site"
      }
    ))
    .pipe(gulp.dest(config.dev.root));
});
