'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

let copyBlazor = build.subTask('copy-blazor', (gulp, buildOptions, done) => {
  gulp.src('./src/webparts/helloWorld/_framework/*').pipe(gulp.dest('./lib/webparts/helloWorld/_framework'));
  done();
})

build.rig.addPreBuildTask(copyBlazor);

build.initialize(require('gulp'));
