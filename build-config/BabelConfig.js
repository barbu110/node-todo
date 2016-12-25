const path = require('path');
const fs = require('fs');
const json5 = require('json5');
const deepExtend = require('deep-extend');

/**
 * Babel configuration wrapper utility.
 */
class BabelConfig {

    /**
     * Construct the Babel configuration from the project's one.
     */
    constructor() {
        const filename = path.resolve(path.join(__dirname, '/../', '.babelrc'));
        const content = fs.readFileSync(filename, 'utf8');

        this._config = json5.parse(content);
    }

    /**
     * Get the constructed configuration.
     */
    getConfig() {
        return this._config;
    }

    /**
     * Add a plugin to the Babel configuration.
     *
     * @param {string} pluginName The name of the plugin to add.
     * @param {mixed} pluginConfig Optional configuration for the plugin.
     *
     * @return {BabelConfig} Returns this, so chains can be created
     */
    addPlugin(pluginName, pluginConfig) {
        let pluginQuery = pluginName;
        if (pluginConfig) {
            pluginQuery = [ pluginName, pluginConfig ];
        }

        deepExtend(this._config, {
            plugins: [
                ...this._config.plugins,
                pluginQuery,
            ],
        });

        return this;
    }
}

module.exports = BabelConfig;
