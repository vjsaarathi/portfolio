const { createWebpackConfig } = require('../../webpack.shared');

module.exports = createWebpackConfig({
  name: 'projects',
  port: 3002,
  appDir: __dirname,
  exposes: {
    './Projects': './src/Projects',
  },
});
