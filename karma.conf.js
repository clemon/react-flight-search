module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['browserify', 'jasmine'],
    files: [
      './src/views/Dashboard.js',
      './test/**/*.test.js'
    ],
    preprocessors: {
      './src/views/Dashboard.js': 'browserify',
      './test/**/*.test.js': 'browserify'
    },
    browserify : {
      debug: true,
      transform : ['babelify']
    },
    client: {
      captureConsole: true
    },
    logLevel: config.LOG_DEBUG
  });
};
