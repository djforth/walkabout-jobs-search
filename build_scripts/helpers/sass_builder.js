const sass         = require('node-sass')
    , config       = require("../config").stylesheets
    , create       = require('./folder_helpers')
    , autoprefixer = require('autoprefixer')
    , postcss      = require('postcss')
    , globbing     = require('node-sass-globbing')
    , sass_helpers = require('./sass_helpers');
// const cachebust    = require('./sass_cachebust');



var createCss = (css, fileName, mapName)=>{
  postcss([ autoprefixer ]).process(css).then(function (post) {
    post.warnings().forEach(function (warn) {
        console.warn(warn.toString());
    });
    create.file(fileName, `${post.css.toString()} \r\r /*# sourceMappingURL=${mapName} */`);
  });

}


module.exports = function(details, data, cb){
  // console.log(details, "dest")
  sass.render({
    file: details.fullPath,
    data: '',
    includePaths : config.includes,
    outputStyle  : details.type || "extended",
    outFile      : details.output,
    sourceMap    :`${details.output}.map`, // or an absolute or relative (to outFile) path
    sourceComments:details.comments || false,
    importer      : globbing,
    functions     : sass_helpers({filePaths:data}),
  }, function(error, result) { // node-style callback from v3.0.0 onwards
    if (error) {
      console.error(error.status); // used to be "code" in v2x and below
      console.error(error.column);
      console.error(error.message);
      console.error(error.line);
    } else {
      createCss(result.css.toString(), details.output, `${details.name}.map`)
      create.file(`${details.output}.map`, result.map.toString());
      // createSourceMap(result.map.toString(), dest);
      cb();
    }
  });
}