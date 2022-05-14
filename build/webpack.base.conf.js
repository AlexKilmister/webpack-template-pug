const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
const CssUrlRelativePlugin = require('css-url-relative-plugin')
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin")

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

const baseWebpackConfig = {
  // BASE config
  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src,
    // module: `${PATHS.src}/your-module.js`,
  },
  output: {
    //filename: `${PATHS.assets}js/[name].[hash].js`,
    //filename: `${PATHS.assets}js/[name].js`,
    path: PATHS.dist,
    publicPath: ''
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
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loader: {
            scss: 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
      test: /\.pug$/,
      oneOf: [
        //this applies to <template lang="pug"> in Vue components
        {
          resourceQuery: /^\?vue/,
          use: ['pug-plain-loader']
        },
        //this applies to pug imports inside JavaScript
        {
          use: ['pug-loader?pretty=true']
        }
      ]
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    },
    {
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      options: {
        name: `${PATHS.assets}fonts/[name].[ext]`
      }
    },
    {
      test: /\.(png|jpe?g|gif|svg|ico)$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]'
      }
    }
    ]
  },
  context: path.resolve('src'),
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.vue' ],
    alias: {
      '~': PATHS.src,
      //'vue$': 'vue/dist/vue.min.js',
      //'vue': '@vue/runtime-dom'
    }
  },
  plugins: [
    new VueLoaderPlugin(),
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
    new CssUrlRelativePlugin(),
    new ImageminWebpWebpackPlugin(),

    // Automatic creation any html pages (Don't forget to RERUN dev server)
    ...PAGES.map(page => {
      let dataPage = {}
      let pathFile = `${PAGES_DIR}${page.replace(/\.pug/, '.json')}`

      try {
        if (fs.existsSync(pathFile)) {
          dataPage = JSON.parse(fs.readFileSync(`${PAGES_DIR}${page.replace(/\.pug/,'.json')}`, 'utf8'))
        }
      } catch(err) {
        console.error(err)
      }

      return new HtmlWebpackPlugin({
        template: `${PAGES_DIR}/${page}`,
        minify: false,
        inject: 'head',
        scriptLoading: 'blocking', //'blocking'|'defer'|'module'
        filename: `./${page.replace(/\.pug/,'.html')}`,
        data: dataPage
      })
    })
  ]
}

module.exports = {PATHS, baseWebpackConfig}
