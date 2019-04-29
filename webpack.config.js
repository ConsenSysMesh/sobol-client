const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const pkg = require('./package.json');

const DEV_MODE = process.env.NODE_ENV === 'development';

module.exports = {
  devtool: DEV_MODE ? 'cheap-module-source-map' : 'source-map',
  entry: {
    browser: './base/index',
  },
  output: {
    path: path.resolve(__dirname, 'browser'),
    filename: `${pkg.name}.js`,
    libraryTarget: 'var',
    library: 'SobolClient',
  },
  module: {
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [
          {
            options: {
              eslintPath: require.resolve('eslint'),
              failOnWarning: true,
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              configFile: path.resolve(__dirname, 'babel.config.js'),
              babelrc: false,
              cacheDirectory: true,
              cacheCompression: !DEV_MODE,
              compact: !DEV_MODE,
              sourceMaps: true,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        output: {
          comments: false,
        },
      },
    })],
  },
  plugins: (() => {
    const plugins = [
      new CleanWebpackPlugin(['browser']),
    ];

    if (process.env.NODE_ENV === 'development') {
      plugins.push(new HtmlWebPackPlugin({
        title: 'Sobol Client',
        filename: 'index.html',
        template: 'examples/broswer.ejs',
        favicon: false,
      }));
    }

    return plugins;
  })(),
};
