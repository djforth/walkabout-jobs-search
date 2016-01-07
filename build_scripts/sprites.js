// Load in dependencies
const _         = require('lodash')
  , config      = require("./config")
  , create        = require('./helpers/folder_helpers')
  , es          = require('event-stream')
  , fs          = require('fs')
  , path        = require('path')
  , readdirp    = require('readdirp')
  , spritesmith = require('spritesmith')
  , templater     = require('spritesheet-templates')


// Removes old files
create.clearFolder(
      config.sprites_img_out
    , config.sprites_ext
    , function(){
      console.log("cleared")
    })

// // Creates folders
create.folder(config.sprites_scss_out);
create.folder(config.sprites_img_out);

// // Stores Sprite list
var storeFiles = function(){
  var folderList = {}

  return function(entry){
    if(entry && !_.has(folderList, entry.dir)){
      folderList[entry.dir] = []
    }

    if(entry){
      folderList[entry.dir].push(entry.path)
    }


    return folderList;
  }
}
// // Init of sprite files list
let manageFiles = storeFiles();

// Builds css
var buildSCSS = (result, sprite, output)=>{

  let spData = []
  _.forIn(result.coordinates, (v,k)=>{
    let obj = {
      name: path.parse(k).name,
    }
    spData.push(_.merge(obj, v))
  })


  let css = templater({
    sprites: spData,
    spritesheet: {
      width: result.properties.width, height: result.properties.height, image: sprite
    }
  }, {format: 'css'});

  let scss = templater({
    sprites: spData,
    spritesheet: {
      width: result.properties.width, height: result.properties.height, image: sprite
    }
  }, {format: 'scss'});


  css = css.replace(/url\(([^)]*)\)/igm,"image-url('$1')")
  // console.log("css", css);

  fs.writeFileSync(path.join(config.sprites_scss_out,`_${output}.scss`), scss + css);

}

// Builds sprites
var buildSprites = ()=>{
  let sprites = manageFiles();
  _.forIn(sprites, (files, output)=>{
    spritesmith({
    src: files,
    algorithm: 'binary-tree'
  }, function handleResult (err, result) {
    // If there was an error, throw it
    if (err) {
      throw err;
    }
    // let date      = new Date();
    // let timestamp = date.getTime();
    // console.log("result", output)
    // Output the image
    fs.writeFileSync(path.join(config.sprites_img_out, `${output}.png`), result.image, 'binary');
    buildSCSS(result, `sprites/${output}.png`, output);
  })

  })
}

// Gets all sprite files
var stream = readdirp({ root: config.sprites_in , fileFilter:config.sprites_ext   });
stream
  .on('warn', function (err) {
    console.error('non-fatal error', err);
    // optionally call stream.destroy() here in order to abort and cause 'close' to be emitted
  })
  .on('error', function (err) { console.error('fatal error', err); })
  .on("data", function(d){storeFiles(d)})
  .on("end", function(d){ buildSprites()})
  .pipe(es.mapSync(function (entry) {
    // console.log('paths', entry);
    return { path: entry.fullPath, dir: entry.parentDir };
  }))
  .pipe(es.map(function(d){
    manageFiles(d);
  }))
  // .pipe()




