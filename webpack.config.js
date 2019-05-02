const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {

    devtool: 'source-map',

    entry: [
        '@babel/polyfill',
		'./web/main.js'
	],
	externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(ttf|eot|svg|gif|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.json/,
                loader: 'json-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'web/react.html', to: 'index.html' }
        ])
    ]
};
