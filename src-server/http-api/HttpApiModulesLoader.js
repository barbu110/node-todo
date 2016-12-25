/**
 * @providesModule HttpApiModulesLoader
 */

import Configuration from 'Configuration';
import HttpApiModule from 'HttpApiModule';

import fs from 'fs';
import path from 'path';

export default class HttpApiModulesLoader {

    /**
     * Construct a HttpApiModulesLoader instance.
     *
     * @param router
     * @param root
     */
    constructor(router, root = Configuration.httpApi.modulesLocation) {
        this._router = router;
        this._root = root;
    }

    /**
     * Find and instantiate all the API module classes.
     *
     * @returns {Map}
     */
    getModules() {
        const modulesPath = path.resolve(this._root);
        const modules = new Map();
        fs.readdirSync(modulesPath).forEach(filename => {
            filename = path.resolve(path.join(modulesPath, filename));
            const className = `__api_module_#${modules.size}`;

            if (!fs.statSync(filename).isFile()) {
                return;
            }

            const apiModule = new (require(filename))();
            if (apiModule instanceof HttpApiModule) {
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
