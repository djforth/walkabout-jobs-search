const _      = require('lodash')
 , config    = require("./config").stylesheets
 , es        = require('event-stream')
 , folder    = require('./helpers/folder_helpers')
 , fs        = require('fs')
 , imagemin  = require('./helpers/imagemin_helper')
 , path      = require('path')
 , sassBuild = require('./helpers/sass_builder');

let img_ext = config.img_ext;
let css_ext = config.css_ext;

//Sets and clears folder
// folder.folder(config.assets_main);

// // Clears css files
// folder.clearFolder(
//       config.assets_main
//     , css_ext
//     , function(){
//       console.log("cleared")
//     })

// // Removes manifest
// fs.access(config.manifest, function(err){
//   if(err)
//     console.log("manifest not there")
//   else
//     fs.unlinkSync(config.manifest);

// });


sass()

function sass(){
  let sassFiles = folder.getFiles(config.input)

  sassFiles
  .on("end", function(){
    console.log('SASS Compiled');
  })
  .pipe(es.mapSync(function(file){
    let ext = path.extname(file.name);
    if(file.name.match(/^_/) || ext !== ".scss"){
      if(ext === ".css"){
        return {
          fullPath:file.fullPath
          , name:file.name
          , scss:false
        }
      }
      return false;
    }

    return {
        fullPath:file.fullPath
      , comments:true
      , name:file.name.replace(".scss", ".css")
      , output:`${config.output}/${file.name.replace(".scss", ".css")}`
      , scss:true
      , type:"nested"
    }
  }))
  .pipe(es.through(function(file){
      this.emit('data', file)

      if(file){
        this.pause();
        if(file.scss){
          sassBuild(file, {}, function(){
            this.resume();
            // console.log('processed');
          }.bind(this))
        } else {

          folder.copyFile(
              file.fullPath
            , path.join(config.output, file.name)
            ,  function(){
              this.resume();
              // console.log('moved >>>>>', file.name);
            }.bind(this))
        }
      }

      return file;
    },
    function end () { //optional
      this.emit('end')
    }));
}