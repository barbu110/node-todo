/**
 * @providesModule condObj
 */

/**
 * Create an object based on the data given as a parameter.
 * @param  {{ [string]: mixed }} data Data given in a string-keyed
 * map. If the given object member is undefined, then it will not
 * be added to the result; otherwise, it will be added as passed.
 * @return {{ [string]: mixed }}
 */
export default function condObj(data) {
    let output = {};
    for (let key: string in data) {
        if (data.hasOwnProperty(key) && data[key] !== undefined) {
            output[key] = data[key];
        }
    }

    return output;
}
