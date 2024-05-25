const webpack =  require('webpack')
const {merge} = require('webpack-merge')
const {PATHS, baseWebpackConfig} = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

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
          options: {
            sourceMap: true,
            postcssOptions: {
              config: `./postcss.config.js`
            }
          }
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
          options: {
            sourceMap: true,
            postcssOptions: {
              config: `./postcss.config.js`
            }
          }
        }
      ]
    }]
  },
  devServer: {
    //contentBase: baseWebpackConfig.externals.paths.dist,
    static: {
      directory: baseWebpackConfig.externals.paths.dist,
      staticOptions: {},
    },
    liveReload: true,
    port: 8081,
    client: {
      logging: "info",
      overlay: true,
      progress: true,
      // overlay: {
      //   warnings: true,
      //   errors: true
      // }
    },

  },
  plugins: [
    new LiveReloadPlugin({  // LiveReloadPlugin is necessary in order to fix live reloading on the dev side
      appendScriptTag: true
    }),
    new MiniCssExtractPlugin({
      //filename: `${PATHS.assets}css/[name].[hash].css`,
      filename: `${PATHS.assets}css/[name].css`,
    }),
    // Define Bundler Build Feature Flags
    new webpack.DefinePlugin({
      // Drop Options API from bundle
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
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
