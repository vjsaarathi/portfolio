const { createWebpackConfig } = require('../../webpack.shared');

module.exports = createWebpackConfig({
  name: 'resume',
  port: 3004,
  appDir: __dirname,
  exposes: {
    './Resume': './src/Resume',
  },
});
