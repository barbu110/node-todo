const webpack = require('webpack');
const baseConfig = require('./base');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
    cache: true,
    devtool: undefined,
    plugins: [
        new ExtractTextPlugin('[name].css', {
            allChunks: true,
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new BowerWebpackPlugin({
            searchResolveModulesDirectories: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
});

module.exports = config;
