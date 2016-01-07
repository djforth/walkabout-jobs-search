const Imagemin = require('imagemin')
    , folder   = require('./folder_helpers')
    , _        = require('lodash');

module.exports = function(path, dest, cb){
  folder.folder(path);

  new Imagemin()
    .src(`${path}/**/*.{gif,jpg,png,svg}`)
    .dest(dest)
    .use(Imagemin.jpegtran({progressive: true}))
    .use(Imagemin.gifsicle({interlaced: true}))
    .use(Imagemin.optipng({optimizationLevel: 3}))
    .run(function (err, files) {
      if(err)
        console.error(err)
      else
        cb();

      console.log("Minified", _.pluck(files, "path"))

    });
}