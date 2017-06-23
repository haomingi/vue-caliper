var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: [path.join(__dirname, './../src/vue-caliper.vue')],
  output: {
    path: path.join(__dirname, '../dists'),
    publicPath: './',
    library: 'VueCaliper',
    libraryTarget: 'umd',
    filename: "[name].js"
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        },
        exclude: [/node_modules/]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
       //正则匹配后缀.sass、.scss文件;
       test: /\.(sass|scss)$/,
       //使用html-webpack-plugin插件独立css到一个文件;
       use: ExtractTextPlugin.extract({
         use: [
           {
             loader : 'css-loader?importLoaders='
           },
           {
             //加载sass-loader同时也得安装node-sass;
             loader: "sass-loader",
               //配置参数;
             options: {
               //sass的sourceMap
               sourceMap:true,
               //输出css的格式两个常用选项:compact({}行), compressed(压缩一行)
               outputStyle : 'compact'
             }
           }
         ]
       })
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: './../dists/index.html',
      template: path.resolve(__dirname, './../demo/index.html'),
      inject: true
    })
  ]
}