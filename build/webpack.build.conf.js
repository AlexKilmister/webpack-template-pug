const {merge} = require('webpack-merge')
const {PATHS, baseWebpackConfig} = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const buildWebpackConfig = merge(baseWebpackConfig, {
	// BUILD config
	mode: 'production',
	output: {
		filename: `${PATHS.assets}js/[name].[hash].js`,
	},
	module: {
		rules: [{
			test: /\.scss$/,
			use: [
				'style-loader',
				MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
				}, {
					loader: 'postcss-loader',
					options: {
						postcssOptions: {
							config: `./postcss.config.js`
						}
					}
				}, {
					loader: 'sass-loader',
				}
			]
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
				}, {
					loader: 'postcss-loader',
					options: {
            postcssOptions: {
              config: `./postcss.config.js`
            }
					}
				}
			]
		}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: `${PATHS.assets}css/[name].[hash].css`,
		}),
		new CleanWebpackPlugin()
	]
})

module.exports = new Promise((resolve, reject) => {
	resolve(buildWebpackConfig)
})
