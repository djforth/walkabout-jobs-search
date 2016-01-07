const fs     = require('fs')
  , _        = require('lodash')
  , mkdirp   = require('mkdirp')
  , readdirp = require('readdirp')
  , path     = require('path')
  , es       = require('event-stream');

const getFiles = (original, fileFilter)=>{
  console.log(original)
  let stream = readdirp({ root: original, fileFilter: fileFilter });

  stream
    .on('warn', function (err) {
      console.error('non-fatal error', err);
    })
    .on('error', function (err) { console.error('fatal error', err); });



    return stream;
}

const createFile = (path, data)=>{
  fs.writeFile(path, data, function(err) {
      if(err) {
          return console.error(err);
      }

      console.log(`${path} Updated`);
  });
};

const createFolder = (path, done)=>{
  // console.log('paths', done);
  mkdirp(path, function (err) {
      if (err) console.error(err)
      else {
        if(_.isFunction(done))
          done(err);

        console.log(`${path} created`);
      }
  });
};

const copyFile = (source, target, cb)=> {
  let cbCalled = false;
  // console.log(source, target
  let rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  let wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}



const copyFolder = (original, newFolder, fileFilter, callback)=>{
  createFolder(newFolder);

  function moveFile(entry, path){
    copyFile(entry.fullPath, `${path}/${entry.path}`, (err)=>{
      if(err){
        console.error(err)
      }
      console.log(`file moved to ${path}/${entry.path}`);
    })
  }

  function createNewFolder(entry, path, done){
    createFolder(`${path}/${entry.parentDir}`, (err)=>{
      if(err){
        console.error(err)
      } else {
        console.log('success');
        if(_.isFunction(done)){
          done();
        }
      }
    });
  }

  let writer = es.writeArray(function(err, array){
    // console.log("files?", array)
    _.forEach(array, (files)=>{
      moveFile(files, newFolder);
    })

    callback()
  })

  let stream = getFiles(original, fileFilter);

  stream
    .pipe(es.through(function(entry){
      this.emit('data', entry)
      if(!_.isEmpty(entry.parentDir)){
        this.pause()
        createNewFolder(entry, newFolder, function(){
          this.resume();
        }.bind(this));
      }

      return entry
    },
    function end () { //optional
      this.emit('end')
    }))
    .pipe(writer);
}

const clearFolder = (folder, fileFilter, cb, rm=false)=>{
  let stream = getFiles(folder, fileFilter);

  stream
    .on("end", (d)=>{
      if(_.isFunction(cb)){
        cb();
      }
    })
    .pipe(
      es.mapSync(function (entry) {
        console.log("CLEARING", entry.fullPath)
        fs.unlinkSync(entry.fullPath);
        return entry.fullPath;
      })
    );

  if(rm){
    fs.rmdirSync(folder)
  }
}






module.exports = {
  clearFolder : clearFolder,
  copyFile    : copyFile,
  copyFolder  : copyFolder,
  file        : createFile,
  folder      : createFolder,
  getFiles    : getFiles
};