const webpack =  require('webpack')
const {merge} = require('webpack-merge')
const {PATHS, baseWebpackConfig} = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
 // devtool: 'cheap-module-eval-source-map',
  devtool: 'inline-cheap-module-source-map',

  output: {
    filename: `${PATHS.assets}js/[name].js`,
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
        }, {
          loader: 'sass-loader',
          options: { sourceMap: true }
        }
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
        }
      ]
    }
    ]
  },
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 8081,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      //filename: `${PATHS.assets}css/[name].[hash].css`,
      filename: `${PATHS.assets}css/[name].css`,
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      // filename: '[name].js.map',
      exclude: 'vendors'
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
})
