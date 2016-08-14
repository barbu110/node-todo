class InvalidRouteError extends Error {

    constructor() {
        super('Provided route is invalid.');
    }

}

module.exports = InvalidRouteError;
