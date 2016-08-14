const Configuration = require('../../config.json');
const ApiModule = require('./ApiModule');

const fs = require('fs');
const path = require('path');
const _ = require('underscore');

class Loader {

    /**
     * Construct a Loader instance.
     *
     * @param router
     * @param path
     */
    constructor(router, path = Configuration.httpApi.modulesLocation) {
        this._router = router;
        this._path = path;
    }

    /**
     * Find and instantiate all the API module classes.
     *
     * @returns {Map}
     */
    getModules() {
        const modulesPath = path.resolve(this._path);
        const modules = new Map();
        fs.readdirSync(modulesPath).forEach(filename => {
            filename = path.resolve(path.join(modulesPath, filename));
            const className = `__api_module_#${modules.size}`;

            if (!fs.statSync(filename).isFile()) {
                return;
            }

            const apiModule = new (require(filename))();
            if (apiModule instanceof ApiModule) {
                modules.set(className, apiModule);
            }
        });

        return modules;
    }

    /**
     * Populate the given router.
     */
    populateRouter() {
        const modules = this.getModules();

        modules.forEach(apiModule => apiModule.buildHandler(this._router));
    }

}

module.exports = Loader;
