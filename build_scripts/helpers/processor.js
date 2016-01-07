// Inspired by https://github.com/fetch/node-sass-asset-functions/blob/master/lib/processor.js

const fs = require('fs')
  , config    = require("../config")
  , path = require('path')
  , url  = require('url')
  , _    = require('lodash');

const mime = require('mime')
  , sizeOf = require('image-size');


class Processor {
  constructor(opts={}){
    this.paths = _.defaults({
      images_path: config.images.output,
      http_images_path: config.images.output
    }, opts);
  }

  asset_url(filepath, segment, done) {
    // console.log('filepath', filepath);
    let http_path, sanitized_http_path, real_path;
    http_path = sanitized_http_path = this.http_path(filepath, segment);
    real_path = this.real_path(filepath, segment);

    let fragmentIndex = sanitized_http_path.indexOf('#'), fragment = '';
    if (~fragmentIndex) {
      fragment = sanitized_http_path.substring(fragmentIndex);
      sanitized_http_path = sanitized_http_path.substring(0, fragmentIndex);
    }

    let restoreFragment = function(url) {
      done(url + fragment);
    };

    let next = function(http_path) {
      restoreFragment(http_path);
    }.bind(this);


    next(sanitized_http_path);

  }

  http_path(filepath, segment) {
    return path.join(this.paths['http_' + segment + '_path'], filepath).replace(/\\/g, '/');
  }

  cache_bust(fileName){
    // console.log(fileName, this.paths.filePaths);
    if(this.paths.filePaths){
      let obj = _.find(this.paths.filePaths, {original:fileName});
      // console.log(obj)
      if(_.isUndefined(obj)){
        return fileName;
      }

      return obj.file;
    }

    return fileName;
  }

  image_url(filepath, done) {
    let fp = this.cache_bust(filepath);
    this.asset_url(fp, 'images', done);
  }



  image_width(filepath, done) {
    let fp = this.cache_bust(filepath);
    // sizes = sizeOf(this.real_path(fp, 'images'))
    sizeOf(this.real_path(fp, 'images'), function (err, size) {
      if(err){
        console.error(err)
        done(0)
      } else {
        done(size.width);
      }

    });
  }

  image_height(filepath, done) {
    let fp = this.cache_bust(filepath);
    sizeOf(this.real_path(fp, 'images'), function (err, size) {
      if(err){
        console.error(err)
        done(0)
      } else {
        done(size.height);
      }

    });
  }

  inline_image(filepath, mime_type, done) {
    let fp = this.cache_bust(filepath);
    let src = this.real_path(fp, 'images');

    mime_type = mime_type || mime.lookup(src);
    fs.readFile(src, function(err, data){
      if(err) {
        console.error(err)
        done("")
      } else {
        done(`data:${mime_type};base64,${data.toString('base64')}`);
      }
    });


  }

  real_path(filepath, segment) {
    let sanitized_filepath = filepath.replace(/(#|\?).+$/, '');
    return path.resolve(this.paths[`${segment}_path`], sanitized_filepath);
  }

}

module.exports = Processor;