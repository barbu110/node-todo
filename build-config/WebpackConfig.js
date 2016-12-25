const webpackConfig = require('../webpack.config.js');

/**
 * Get the index of a loader in the current webpack configuration.
 *
 * @param {object} config
 * @param  {string} loaderName
 *
 * @return {int} The index of the found loader or -1 if the loader
 * was not found.
 */
function getLoaderIndex(config, loaderName) {
    if (!(config.module.loaders instanceof Array)) {
        return -1;
    }

    return config.module.loaders.findIndex((loaderConfig) => {
        return loaderConfig.loader === loaderName;
    });
}

module.exports = function(configFile) {
    let module = {
        getLoaderIndex: loaderName => getLoaderIndex(webpackConfig, loaderName),
    }

    return module;
};
