/**
 * @providesModule stringSize
 */

/**
 * Calculate the size of a UTF8 string.
 * @param {string} str
 * @return {int}
 */
export default function stringSize(str) {
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}
