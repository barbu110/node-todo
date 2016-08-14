class InvalidHTTPMethodError extends Error {

    constructor(method) {
        super(`Invalid HTTP method "${method}"`);
    }

}

module.exports = InvalidHTTPMethodError;
