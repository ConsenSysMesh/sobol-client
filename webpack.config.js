const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const pkg = require('./package.json');

const DEV_MODE = process.env.NODE_ENV === 'development';

module.exports = {
  devtool: DEV_MODE ? 'eval' : 'source-map',
  entry: './src/browser',
  output: {
    path: path.resolve(__dirname, '/dist'),
    filename: `${pkg.name}.js`,
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
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebPackPlugin({
      title: 'TMNT API Client',
      filename: 'index.html',
      template: 'tests/broswer.ejs',
      favicon: false,
    }),
  ],
};
