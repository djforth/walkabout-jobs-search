 const _     = require("lodash")
 , b_helper  = require("./helpers/browserify_builder")
 , config    = require("./config")
 , es        = require("event-stream")
 , folder    = require("./helpers/folder_helpers")
 , fs        = require("fs");

let args = process.argv.slice(2, process.argv.length)


_.forEach(config.javascript_files, (js)=>{
  b_helper(js, _.includes(args, "--watch"), _.includes(args, "--minify"));
})