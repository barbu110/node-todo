/**
 * @providesModule InvalidRouteError
 */

export default class InvalidRouteError extends Error {

    constructor() {
        super('Provided route is invalid.');
    }

}
