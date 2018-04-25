const webpack = require('webpack');
let path = require('path');
let CopyWebpackPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const getAppResources = (isProd) => {
    let result = [
        'babel-polyfill',
        'react-hot-loader/patch',
        'js/index.js'
    ];

    if (!isProd) {
        result.push('webpack-dev-server/client?http://localhost:8080',
                    'webpack/hot/only-dev-server');
    }

    return result;
};

const getAppPlugins = (isProd) => {
    let result = [
		new webpack.NamedModulesPlugin(),
		new CopyWebpackPlugin([
            {
                from: './src/app.js',
                to: path.join(__dirname, './build')
            },
			{
                from: './src/main/index.html',
                to: path.join(__dirname, './build')
            },
			{
                from: './src/main/css',
                to: path.join(__dirname, './build/css')
            },
			{
                from: './src/main/fonts',
                to: path.join(__dirname, './build/fonts')
            }
        ]),
    ];
    
    if (!isProd) {
        result.push(new webpack.HotModuleReplacementPlugin());
    }

    return result;
}

const config = {
	context: path.resolve(__dirname),
	target: "electron",
	devtool: isProd ? 'source-map' : 'inline-source-map',
	resolve: {
		alias: {
			'js': path.resolve(__dirname, 'src/main/js'),
            'css': path.resolve(__dirname, 'src/main/css')
		}
	},
	entry: {
		'app': getAppResources(isProd)
	},
	output: {
		path: path.resolve(__dirname, './build'),
		filename: 'app.bundle.js',
		publicPath: isProd ? '/' : 'http://localhost:8080/'
	},
	module: {
		loaders: [
			{
				exclude: /node_modules/,
				test : /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015', 'stage-1'],
				}
			}
		]
	},
	plugins: getAppPlugins(isProd)
};

if (!isProd) {
    config.devServer = {
		hot: true,
		publicPath: 'http://localhost:8080/',
		historyApiFallback: true
	}
}

module.exports = config;
