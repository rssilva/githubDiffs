var babel = require('babel-core');
var grunt = require('grunt')
var fs = require('fs');
var mkdirp = require('mkdirp');

var path = process.argv[2];

babel.transformFile(path, {}, function (err, result) {
  var dest = path.replace(/^app\//, './build/');

  fs.writeFile(dest, result.code, function (err, result) {
    if (err) console.log(err)

    console.log(dest)
  });
});
