var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path');
var webpack = require('webpack');
// 引入基本配置
var config = require('./webpack.config');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

config.output.publicPath = '/';

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new HtmlWebpackPlugin({
    filename: './../dists/index.html',
    template: path.resolve(__dirname, './../demo/index.html'),
    inject: true
  }),
  new FriendlyErrorsPlugin()
];

// 动态向入口配置中注入 webpack-hot-middleware/client
var devClient = './build/dev-client';
var extras = [devClient];
config.entry = extras.concat(config.entry);

module.exports = config;