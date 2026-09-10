const { createWebpackConfig } = require('../../webpack.shared');

module.exports = createWebpackConfig({
  name: 'landing',
  port: 3001,
  appDir: __dirname,
  exposes: {
    './Landing': './src/Landing',
  },
});
