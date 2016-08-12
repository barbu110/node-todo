const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const srcPath = path.join(__dirname, '/../../src');
const entryPath = path.join(srcPath, 'entry');
const defaultPort = 8080;

function buildEntryPointsList() {
    var entry = {};
    fs.readdirSync(entryPath).forEach(file => {
        const filename = file.match(/(.*).js$/);
        if (filename) {
            const chunkname = filename[1];
            entry[chunkname] = path.resolve(entryPath, filename[0]);
        }
    });

    /*eslint no-console:0 */
    console.log(entry);
    return entry;
}

module.exports = {
    entry: buildEntryPointsList(),
    port: defaultPort,
    debug: true,
    devtool: 'eval',
    output: {
        path: path.resolve(__dirname, '../../dist/assets'),
        filename: '[name].js',
        publicPath: '/assets/',
    },
    resolve: {
        extensions: [ '', '.js', '.jsx', '.scss' ],
        alias: {
            actions: `${srcPath}/actions`,
            components: `${srcPath}/components`,
            sources: `${srcPath}/sources`,
            stores: `${srcPath}/stores`,
            styles: `${srcPath}/styles`,
            images: `${srcPath}/images`,
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
                    'css?modules&importLoaders=1&localIdentName=[hash:base64:10]',
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
            },
        ],
    },
    postcss: () => [
        autoprefixer,
    ],
};
