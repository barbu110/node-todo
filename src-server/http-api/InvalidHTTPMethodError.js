/**
 * @providesModule InvalidHTTPMethodError
 */

export default class InvalidHTTPMethodError extends Error {

    constructor(method) {
        super(`Invalid HTTP method "${method}"`);
    }

}
