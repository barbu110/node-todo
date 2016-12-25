const hasteMapper = require('haste-mapper');

/**
 * Change the root directory for the modules. Used in the server
 * building process, where path rewriting is needed so as modules
 * are found in the dist directory, not the source one.
 *
 * @param  {ModulesMap} modulesMap
 * @param  {string|RegExp} regex
 * @param  {string} rewrite
 * @return {object}
 */
function remapModules(modulesMap, regex, rewrite) {
    modulesMap = hasteMapper.ModulesMapUtils.toPlainObject(modulesMap);

    for (let moduleName in modulesMap) {
        if (modulesMap.hasOwnProperty(moduleName)) {
            const source = modulesMap[moduleName];
            modulesMap[moduleName] = source.replace(regex, rewrite);
        }
    }

    return modulesMap;
}

module.exports = remapModules;
