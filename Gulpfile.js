const babel = require('gulp-babel');
const BabelConfig = require('./build-config/BabelConfig');
const deepExtend = require('deep-extend');
const entryPoint = require('./build-config/entryPoint');
const fs = require('fs');
const gulp = require('gulp');
const hasteMapper = require('haste-mapper');
const path = require('path');
const remapModules = require('./build-config/remapModules');
const webpack = require('webpack-stream');
const webpackVersion = require('webpack');

const serverRoot = path.resolve(path.join(__dirname, 'src-server'));
const serverBuild = path.resolve(path.join(__dirname, 'dist', 'server'));
const clientRoot = path.resolve(path.join(__dirname, 'src-client'));
const clientBuild = path.resolve(path.join(__dirname, 'dist', 'assets'));

gulp.task('server:build', (done) => {
    hasteMapper.scanModules({
        rootDir: serverRoot,
        files: [
            path.resolve('./config.js'),
        ],
    }).then(modulesList => {
        const babelConfig = new BabelConfig().addPlugin('haste-require', {
            map: remapModules(modulesList, serverRoot, serverBuild),
        });

        gulp
            .src(`${serverRoot}/**/*.js`)
            .pipe(babel(babelConfig.getConfig()))
            .pipe(gulp.dest(serverBuild))
            .on('end', done);
    });
});

gulp.task('client:build', (done) => {
    let webpackConfig = Object.create(require('./webpack.config.js'));

    const webpackFirstEntry = entryPoint.buildEntryPointsList()['app'];
    const configUtils = require('./build-config/WebpackConfig')(webpackConfig);

    webpackConfig.watch = true;

    hasteMapper.scanModules({
        rootDir: [ serverRoot, clientRoot ],
    }).then(modulesList => {
        const babelConfig = new BabelConfig();
        babelConfig.addPlugin('haste-require', {
            map: hasteMapper.ModulesMapUtils.toPlainObject(modulesList),
        });

        const indexOfBabel = configUtils.getLoaderIndex('babel');
        webpackConfig.module.loaders[indexOfBabel].query = babelConfig.getConfig();

        gulp
            .src(webpackFirstEntry)
            .pipe(webpack(webpackConfig, webpackVersion))
            .pipe(gulp.dest(clientBuild))
            .on('end', done);
    });
});
