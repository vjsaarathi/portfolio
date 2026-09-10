const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

/**
 * Creates a webpack config for a microfrontend application.
 *
 * @param {Object} options
 * @param {string} options.name - Unique name for this federated module (e.g., 'projects')
 * @param {number} options.port - Dev server port
 * @param {string} options.appDir - Absolute path to the app directory
 * @param {Object} [options.exposes] - Module Federation exposes map
 * @param {Object} [options.remotes] - Module Federation remotes
 * @param {Object} [options.extraShared] - Additional shared dependencies
 * @param {Object[]} [options.extraRules] - Additional webpack module rules
 * @param {Object[]} [options.extraPlugins] - Additional webpack plugins
 * @param {string} [options.entry] - Custom entry point (defaults to './src/index')
 * @returns {Object} Webpack configuration
 */
function createWebpackConfig({
  name,
  port,
  appDir,
  exposes = {},
  remotes = {},
  extraShared = {},
  extraRules = [],
  extraPlugins = [],
  entry = './src/index',
}) {
  const isProd = process.env.NODE_ENV === 'production';
  const publicPath = isProd
    ? `/portfolio/remotes/${name}/`
    : `http://localhost:${port}/`;

  return {
    mode: isProd ? 'production' : 'development',
    entry,
    output: {
      path: path.resolve(appDir, 'dist'),
      filename: '[name].[contenthash:8].js',
      publicPath,
      clean: true,
    },
    devServer: {
      port,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      historyApiFallback: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.vue', '.svelte'],
      conditionNames: ['svelte', 'browser', 'import', 'module', 'require', 'node'],
      symlinks: true,
      alias: {
        '@impossible-resume/event-bus': path.resolve(__dirname, 'packages/event-bus/src'),
        '@impossible-resume/runtime-tracker': path.resolve(__dirname, 'packages/runtime-tracker/src'),
        '@impossible-resume/design-tokens': path.resolve(__dirname, 'packages/design-tokens'),
        '@impossible-resume/framework-adapters': path.resolve(__dirname, 'packages/framework-adapters/src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        ...extraRules,
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name,
        filename: 'remoteEntry.js',
        exposes,
        remotes,
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.3.0',
            eager: false,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.3.0',
            eager: false,
          },
          '@impossible-resume/event-bus': {
            singleton: true,
            eager: false,
          },
          '@impossible-resume/runtime-tracker': {
            singleton: true,
            eager: false,
          },
          ...extraShared,
        },
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(appDir, 'public/index.html'),
        excludeChunks: [name],
      }),
      ...extraPlugins,
    ],
    snapshot: {
      managedPaths: [],
    },
    optimization: {
      splitChunks: false,
    },
  };
}

module.exports = { createWebpackConfig };
