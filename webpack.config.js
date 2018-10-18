const path = require('path');
const pkg = require('./package.json');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const DEV_MODE = process.env.NODE_ENV === 'development';

module.exports = {
  devtool: DEV_MODE ? 'inline-source-map' : 'source-map',
  entry: {
    browser: './src/browser',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `${pkg.name}-[name].js`,
    libraryTarget: 'var',
    library: 'TmntApi',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        warnings: false,
        output: {
          comments: false
        },
      }
    })],
  },
  performance: {
    hints: false
  },
  plugins: (function() { 
    var plugins = [
      new CleanWebpackPlugin(['dist'])
    ];

    if (process.env.NODE_ENV === 'development') {
      plugins.push(new HtmlWebPackPlugin({
        title: 'TMNT API Client',
        filename: 'index.html',
        template: 'tests/broswer.ejs',
        favicon: false,
      }));
    }

    return plugins;
  })(),
};
