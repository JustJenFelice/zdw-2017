var gulp = require("gulp");

/* Basic */
require("./gulp/tasks/server.js");
require("./gulp/tasks/templates.js");
require("./gulp/tasks/styles.js");
require("./gulp/tasks/watch.js");
require("./gulp/tasks/svg.js");
require("./gulp/tasks/build.js");

gulp.task("default", ["server:html", "watch"]);
