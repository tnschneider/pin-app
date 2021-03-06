const webpack = require('webpack');
let path = require('path');
let CopyWebpackPlugin = require('copy-webpack-plugin');

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
	const copyToDistAssets = (from, subdir) => ({
		from: from,
		to: subdir ? path.join(__dirname, './build', subdir)
				   : path.join(__dirname, './build')
	});

    let result = [
		new webpack.NamedModulesPlugin(),
		new CopyWebpackPlugin([
			copyToDistAssets('./src/app.js'),
			copyToDistAssets('./assets'),
			copyToDistAssets('./src/index.html'),
			copyToDistAssets('./src/bootstrap.js'),
            copyToDistAssets('./src/css', 'css'),
            copyToDistAssets('./src/fonts', 'fonts'),
            copyToDistAssets('./src/shared', 'shared')
        ]),
    ];
    
    if (!isProd) {
        result.push(new webpack.HotModuleReplacementPlugin());
    }

    return result;
}

module.exports = (env) => {
	const isProd = env.production;

	const config = {
		context: path.resolve(__dirname),
		target: "electron-renderer",
		mode: isProd ? 'production' : 'development',
		devtool: isProd ? 'source-map' : 'inline-source-map',
		entry: {
			'app': getAppResources(isProd)
		},
		resolve: {
			alias: {
				'js': path.resolve(__dirname, 'src/js'),
				'css': path.resolve(__dirname, 'src/css'),
				'shared': path.resolve(__dirname, 'src/shared')
			}
		},
		output: {
			path: path.resolve(__dirname, './build'),
			filename: 'bundle.js',
			publicPath: isProd ? '/' : 'http://localhost:8080/'
		},
		module: {
			rules: [
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
	}

	if (!isProd) {
		config.devServer = {
			hot: true,
			publicPath: 'http://localhost:8080/',
			historyApiFallback: true
		}
	}

	return config;
};