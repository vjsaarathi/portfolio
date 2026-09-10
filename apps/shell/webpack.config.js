const { createWebpackConfig } = require('../../webpack.shared');

const config = createWebpackConfig({
  name: 'shell',
  port: 3000,
  appDir: __dirname,
  remotes: {},
  exposes: {},
  entry: './src/index',
});

config.output.publicPath = process.env.NODE_ENV === 'production'
  ? '/portfolio/'
  : 'http://localhost:3000/';

module.exports = config;
