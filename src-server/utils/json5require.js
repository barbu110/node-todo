/**
 * @providesModule json5require
 */

require.extensions['.json'] = function (module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    module.exports = json5.parse(content);
};
