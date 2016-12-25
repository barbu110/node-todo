const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const entryPoint = require('./entryPoint');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const defaultPort = 8080;
const srcPath = entryPoint.srcPath;

module.exports = {
    entry: entryPoint.buildEntryPointsList(),
    port: defaultPort,
    debug: true,
    devtool: 'eval',
    output: {
        path: path.resolve(__dirname, '../dist/assets'),
        filename: '[name].js',
        publicPath: '/assets/',
    },
    resolve: {
        extensions: [ '', '.js', '.jsx', '.scss' ],
        alias: {
            actions: `${srcPath}/actions`,
            components: `${srcPath}/components`,
            dispatchers: `${srcPath}/dispatchers`,
            sources: `${srcPath}/sources`,
            stores: `${srcPath}/stores`,
            styles: `${srcPath}/styles`,
            images: `${srcPath}/images`,
            routes: `${srcPath}/routes`,
            api: `${srcPath}/api`,
            'src-server': path.join(srcPath, '../', 'src-server'),
        },
    },
    module: {
        preLoaders: [ {
            test: /\.(js|jsx)$/,
            include: srcPath,
            loader: 'eslint-loader',
        } ],
        loaders: [
            {
                test: /\.scss/,
                loader: ExtractTextPlugin.extract([
                    // 'style?sourceMap',
                    'css?modules&importLoaders=1&localIdentName=[local]__[hash:base64:10]',
                    'resolve-url',
                    'sass?outputStyle=compressed',
                    'postcss',
                ]),
            },
            {
                test: /\.(mp4|ogg|svg|png|jpg|gif|woff|woff2|ttf)$/,
                loader: 'file',
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel',
                cacheDirectory: true,
            },
        ],
    },
    postcss: () => [
        autoprefixer,
    ],
};
