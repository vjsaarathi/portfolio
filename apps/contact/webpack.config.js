const { createWebpackConfig } = require('../../webpack.shared');

module.exports = createWebpackConfig({
  name: 'contact',
  port: 3005,
  appDir: __dirname,
  exposes: {
    './Contact': './src/Contact',
  },
  extraShared: {
    '@formspree/react': {
      singleton: true,
      requiredVersion: '^2.5.0',
    },
  },
});
