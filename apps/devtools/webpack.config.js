const { createWebpackConfig } = require('../../webpack.shared');

module.exports = createWebpackConfig({
  name: 'devtools',
  port: 3007,
  appDir: __dirname,
  exposes: {
    './DevTools': './src/DevTools',
  },
  extraShared: {
    d3: {
      singleton: true,
      requiredVersion: '^7.0.0',
    },
  },
});
