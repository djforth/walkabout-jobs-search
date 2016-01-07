// Karma configuration
// Generated on Sun Jun 07 2015 21:56:30 GMT+0100 (BST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './node_modules/babel-polyfill/browser.js',
      './node_modules/react-tools/src/test/phantomjs-shims.js',
      // './spec/factories/*_spec.es6.js'
      './spec/**/*_spec.es6.js',
      './src/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './spec/**/*_spec.es6.js' : [ 'browserify' ],
      './src/**/*.js' : [ 'browserify' ]

    },

    browserify: {
      debug: false,
      transform: [['rewireify', { ignore: 'moof' }]],
      extensions: [ ".es6.js", ".js"],
      bundleDelay: 1000
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['story', 'progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'PhantomJS', 'Opera', 'Safari', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
  });
};
