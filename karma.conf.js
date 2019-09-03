const webpackConfig = require('@vue/cli-service/webpack.config.js');

module.exports = (config) => {
  config.set({
    frameworks: ['mocha'],
    files: ['test/**/*.spec.js'],
    preprocessors: {
      '**/*.spec.js': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    reporters: ['spec'],
    browsers: ['ChromeHeadless'],
  });
};
