const webpack = require('webpack');
const baseConfig = require('./base');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
    cache: true,
    devtool: 'source-map',
    plugins: [
        new ExtractTextPlugin('[name].css', {
            allChunks: true,
        }),
        new webpack.NoErrorsPlugin(),
        new BowerWebpackPlugin({
            searchResolveModulesDirectories: false,
        }),
    ],
});

module.exports = config;
