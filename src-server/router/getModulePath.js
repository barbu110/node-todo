/**
 * @providesModule Router/getModuleUrl
 */

/**
 * Get the absolute URL for the desired module.
 *
 * @param {string} name
 * @param {string} type One of 'js', 'style';
 * @returns {string}
 */
export default function getModuleUrl(name, type) {
    switch (type) {
    case 'js':
        return `/assets/${name}.js`;
    case 'style':
        return `/assets/${name}.css`;
    default:
        throw new Error('Unknown module type ' + type);
    }
}
