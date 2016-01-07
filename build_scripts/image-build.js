const config = require("./config").images
 , folder    = require('./helpers/folder_helpers')
 , imagemin  = require('./helpers/imagemin_helper');

let img_ext = config.ext;

// Minify Images
imagemin(
  config.input
, config.output
, function(){
  console.log('minified');
})
