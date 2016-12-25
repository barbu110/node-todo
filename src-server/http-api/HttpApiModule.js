/**
 * @providesModule HttpApiModule
 */

import HttpUtils from 'HttpUtils';
import InvalidRouteError from 'InvalidRouteError';
import InvalidHTTPMethodError from 'InvalidHTTPMethodError';
import Methods from 'methods';
import _ from 'underscore';

/**
 * @abstract
 */
export default class HttpApiModule {

    /**
     * Enforce user authentication;
     */
    enforceAuthentication() {
        this._enforceAuth = true;
    }

    /**
     * Set required user permissions.
     *
     * @param {string|string[]} permissions
     */
    enforceUserPermissions(permissions) {
        if (typeof permissions === 'string') {
            permissions = [ permissions ];
        }

        this._enforcePermissions = permissions;
    }

    /**
     * Set the accepted HTTP method for the API module.
     *
     * @param {string} method
     * @throws InvalidHTTPMethodError
     */
    setMethod(method) {
        method = method.toLowerCase();
        if (_.indexOf(Methods, method) === -1) {
            throw new InvalidHTTPMethodError(method);
        }

        this._method = method;
    }

    /**
     * Set the route of the API module.
     *
     * @param route
     * @throws InvalidRouteError
     */
    setRoute(route) {
        if (typeof route !== 'string') {
            throw new InvalidRouteError(route);
        }
        if (route[0] !== '/') {
            route = `/${route}`;
        }

        this._route = route.replace(/\/{2,}/g, '/');
    }

    /**
     * Construct the route handler and add it to the Express router.
     *
     * @param router
     */
    buildHandler(router) {
        if (!this._route) {
            throw new Error('No route was provided');
        }
        if (typeof this.execute !== 'function') {
            throw new Error('Every API module must provide the "execute" method');
        }
        if (!this._method) {
            this._method = 'get';
        }

        let handlersChain = [];

        if (this._enforceAuth) {
            handlersChain.push(HttpUtils.enforceAuthentication);
        }
        if (this._enforcePermissions) {
            handlersChain.push((req, res, next) =>
                HttpUtils.enforceUserPermissions(req, res, next, this._enforcePermissions));
        }
        handlersChain.push(this.execute);

        router[this._method](this._route, handlersChain);
    }

}
