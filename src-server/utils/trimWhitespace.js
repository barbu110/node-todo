/**
 * @providesModule trimWhitespace
 */

const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

/**
 * Trim trailing whitespace in a string.
 *
 * @param {string} str
 * @return {string}
 * @see http://james.padolsey.com/jquery/#v=git&fn=jQuery.trim
 */
export default function trimWhitespace(str) {
    return str == null ? '' : (str + '').replace(rtrim, '');
}
