const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')

// Main const
const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
}

// Pages const for HtmlWebpackPlugin
// const PAGES_DIR = PATHS.src
const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  // BASE config
  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src,
    // module: `${PATHS.src}/your-module.js`,
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [{
      test: /\.pug$/,
      oneOf: [
        //this applies to <template lang="pug"> in Vue components
        {
          resourceQuery: /^\?vue/,
          use: ['pug-bem-plain-loader']
        },
        //this applies to pug imports inside JavaScript
        {
          use: ['pug-loader?pretty=true']
        }
      ]
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loader: {
          scss: 'vue-style-loader!css-loader!sass-loader'
        }
      }
    }, {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      options: {
        name: `${PATHS.assets}fonts/[name].[ext]`
      }
    }, {
      test: /\.(png|jpe?g|gif|svg|ico)$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]'
      }
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
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
        MiniCssExtractPlugin.loader,
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
  context: path.resolve('src'),
  resolve: {
    alias: {
      '~': PATHS.src,
      'vue$': 'vue/dist/vue.min.js',
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[hash].css`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
        //{ from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
        { from: `${PATHS.src}/static`, to: '' },
      ]
    }),
    new SVGSpritemapPlugin(`${PATHS.src}/${PATHS.assets}img/icons-svg/**/*.svg`, {
      output: {
        svg: {
          // Disable `width` and `height` attributes on the root SVG element
          // as these will skew the sprites when using the <view> via fragment identifiers
          sizes: false
        },
        svg4everybody: true,
        filename: 'assets/img/spriteSvg.svg'
      },
      sprite: {
        generate: {
          // Generate <use> tags within the spritemap as the <view> tag will use this
          use: true,

          // Generate <view> tags within the svg to use in css via fragment identifier url
          // and add -fragment suffix for the identifier to prevent naming colissions with the symbol identifier
          view: '-fragment',

          // Generate <symbol> tags within the SVG to use in HTML via <use> tag
          symbol: true
        },
      },
      styles: {
        // Specifiy that we want to use URLs with fragment identifiers in a styles file as well
        format: 'fragment',

        // Path to the styles file, note that this method uses the `output.publicPath` webpack option
        // to generate the path/URL to the spritemap itself so you might have to look into that
        //filename: path.join(__dirname, 'src/scss/_sprites.scss')
      }
    }),

    // Automatic creation any html pages (Don't forget to RERUN dev server)
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      minify: false,
      filename: `./${page.replace(/\.pug/,'.html')}`
    }))
  ]
}
