var browserify = require('browserify')
 , babelify    = require("babelify")
 , config      = require("../config")
 , es          = require('event-stream')
 , folder      = require('./folder_helpers')
 , fs          = require('fs')
 , path        = require('path')
 , UglifyJS    = require("uglify-js")
 , watchify    = require("watchify");

let inPaths  = fileIn(config.javascripts_in)
let outPaths = fileRegExp(config.js_ext, config.javascripts_out);


function uglifyScript(file){
  var result = UglifyJS.minify(file);
  // console.log(result.code);
  fs.writeFile(file.replace(".js", ".min.js"), result.code, function(err) {
      if(err) {
          return console.error(err);
      }

      console.log(`Minified ${file}`);
  });
}

function fileRegExp(exts_in, output, ext=".js"){
  let ext_str  = exts_in.join("|");
  let regex    = new RegExp(`(${ext_str})$`);
  let out_path = output
  return function(name){
    return path.join(out_path, name.replace(regex, ext));
  }
}

function fileIn(input){
  let in_path= input;
  return function(file){
    return path.join(in_path, file)
  }
}

function writeFile(file, minify){
  let filePath = outPaths(file);
  let mini     = minify
  return function(){
    var wr = fs.createWriteStream(filePath);
    wr.on("error", function(err) {
        console.error('err', err);
      });
    wr.on("close", function(ex) {
      //Minifiy if required
      if(mini)
        uglifyScript(outPaths(file))
    });

    return wr
  }

}

function bundleShare(b, writer) {
  // var wr = writeFile(file, minify);
  b.bundle()
   .on('data', function(err){
    if(err.message)
      console.log(err.toString());
      // this.close();
    })
   .pipe(writer())

}


module.exports = function(file, watch=false, minify=false){
  var b = browserify({entries: [inPaths(file)], extensions:config.js_ext, debug:true, cache: {}, packageCache: {}})

  let writer = writeFile(file, minify);
  // b.ignore('moment')
  b.transform(
    babelify.configure({stage: 0})
  )

  if(watch){
    console.log("watching")
    var w = watchify(b);
    w.on("update", function(d){
      console.log("compiling", d.toString())
      bundleShare(w, writer);
    })

    bundleShare(w, writer);
  } else {
    b.bundle()
    .pipe(writer())
  }


}


