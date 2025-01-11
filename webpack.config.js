const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
	devServer: {
		port: 4000,
		historyApiFallback: true,
	},
	entry: {
		home: './pages/home/index.js',
		case: './pages/case-study/index.js',
		api: './pages/api-key/index.js',
		thanks: './pages/thanks-you/index.js',
		'main-vdb': './pages/main-vdb/index.js',
		'v-prod': './pages/v-prod/index.js',
		pricing: './pages/pricing/index.js',
		'vdb-thank-you': './pages/vdb-thank-you/index.js',
		houdini: './pages/houdini/index.js',
		'houdini-download': './pages/houdini-download/index.js',
		'houdini-thank-you': './pages/houdini-thank-you/index.js',
		studio: './pages/studio/index.js',
		'studio-thanks-you': './pages/studio-thanks-you/index.js',
		'studio-download': './pages/studio-download/index.js',
		'get-help': './pages/get-help/index.js',
		license: './pages/license/index.js',
		'free-effects': './pages/free-effects/index.js',
	},
	output: {
		path: path.join(__dirname, '/build'),
		filename: '[name].min.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: './index.html',
		}),
	],
}
