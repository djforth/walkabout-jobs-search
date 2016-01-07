const path      = require('path');

module.exports = {
    assets_main      : path.join("public", "assets")
  // , css_ext          : ['*.css', '*.css.map', "*.gz"]
  // Critical Path configuration
  , critical_css     : {
    additional : []
  , json       : "config/critical_css.json"
  , local      : "http://localhost:9090"
  , production : "http://better.org.uk"
  , store      : path.join("lib", "assets", "critical")
  },
  // Images configuration
  images : {
    ext    : ['*.png', '*.gif', '*.jpg', '*.jpeg', '*.svg']
  , input  : path.join("assets", "images")
  , output : "/assets/images"
  , temp   : path.join("tmp", "images")
  },
  // JavaScript config
  javascript : {
    ext    : ['.js', ".es6.js"]
  , files  : ["components.es6.js"]
  , input  : path.join("app", "src")
  , output : path.join("app", "lib")
  },
  // Stylesheets config
  stylesheets : {
    ext      : ['*.css', '*.css.map', "*.gz"]
  , includes : ['./bower_components/']
  , input   : path.join("test_assets", "stylesheets")
  , output   : path.join("app", "assets", "stylesheets")
  },

  // , javascript_files : ["components.es6.js"]
  // , javascripts_in   : path.join("app", "assets_uncompiled", "javascripts")
  // , javascripts_out  : path.join("app", "assets", "javascripts")
  // , js_ext           : ['.js', ".es6.js"]
  // , manifest         : "config/asset-manifest.json"
  // , sprites_in       : path.join("app", "assets_uncompiled", "sprites")
  // , sprites_img_out  : path.join("app", "assets_uncompiled", "images", "sprites")
  // , sprites_scss_out : path.join("app", "assets", "stylesheets" , "sprites")
  // , sprites_ext      : ['*.png', '*.gif']
  // , stylesheets_in   : path.join("app", "assets_uncompiled", "stylesheets")
  // , stylesheets_out  : path.join("public", "assets")
  // , stylesheets_temp : path.join("tmp", "stylesheets")

}