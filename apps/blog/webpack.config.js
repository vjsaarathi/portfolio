const { createWebpackConfig } = require('../../webpack.shared');
const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

module.exports = createWebpackConfig({
  name: 'blog',
  port: 3003,
  appDir: __dirname,
  exposes: {
    './Blog': './src/index',
  },
  extraRules: [
    {
      test: /\.vue$/,
      loader: 'vue-loader',
    },
    {
      test: /\.m?js/,
      resolve: {
        fullySpecified: false
      }
    },
    {
      test: /posts-manifest\.js$/,
      use: [path.resolve(__dirname, 'loaders/markdown-posts-loader.js')],
      type: 'javascript/auto',
    },
    {
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'assets/[name].[contenthash:8][ext]',
      },
    },
  ],
  extraPlugins: [
    new VueLoaderPlugin(),
  ],
  extraShared: {
    vue: {
      singleton: true,
      requiredVersion: '^3.4.0',
      eager: false,
    },
  },
});
