const { createWebpackConfig } = require('../../webpack.shared');

module.exports = createWebpackConfig({
  name: 'playground',
  port: 3006,
  appDir: __dirname,
  exposes: {
    './Playground': './src/index',
  },
  extraRules: [
    {
      test: /\.svelte$/,
      use: {
        loader: 'svelte-loader',
        options: {
          emitCss: false,
        },
      },
    },
    {
      test: /node_modules\/svelte\/.*\.mjs$/,
      resolve: {
        fullySpecified: false,
      },
    },
  ],
});
