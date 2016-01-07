const _      = require('lodash')
 , config    = require("./config")
 , es        = require('event-stream')
 , folder    = require('./helpers/folder_helpers')
 , fs        = require('fs')
 , imagemin  = require('./helpers/imagemin_helper')
 , path      = require('path');

let img_ext = config.img_ext;
let css_ext = config.css_ext;

 //Sets and clears folder
folder.folder(config.assets_main);

folder.clearFolder(
      config.assets_main
    , img_ext.concat(css_ext)
    , function(){
      console.log("cleared assets")
    });

fs.access(config.manifest, function(err){
  if(err)
    console.log("manifest not there")
  else
    fs.unlinkSync(config.manifest);
});