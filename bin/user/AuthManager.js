/*eslint no-console:0 */

const Database = require('../database');
const Password = require('./Password');
const JWT = require('jsonwebtoken');
const Configuration = require('../../config.json');
const AccountsRepository = require('./AccountsRepository');
const moment = require('moment');
const crypto = require('crypto');
const async = require('async');

class AuthManager {

    constructor(request) {
        this._request = request;
    }

    /**
     * Authenticate a user given their credentials.
     *
     * @param {string} username
     * @param {string} password
     * @param {function(err: Error, jwt: string?)} callback
     */
    authenticate(username, password, callback) {
        Database.query('SELECT password FROM public.user WHERE username = $1', [ username ])
            .then(result => {
                if (!result.rowCount) {
                    callback(new Error('The account does not exist'));
                }

                const row = result.rows[0];
                if (!Password.validateSync(password, row.password)) {
                    callback(new Error('Invalid password'));
                }

                const repo = new AccountsRepository();
                async.waterfall([
                    (next) => repo.getAccount({ username }, next),
                    (account, next) => this.recordAuthFingerprint(account, (err, token) => next(err, account, token)),
                    (account, authToken) => {
                        const now = moment();

                        const jwt = JWT.sign({
                            authToken,
                            accountToken: account.getToken(),
                            username: account.getUsername(),
                            displayName: account.getDisplayName(),
                            profilePicture: account.getProfilePicture(),
                            permissions: account.getPermissions()._permissions,
                            exp: Number.parseInt(now.add(
                                Configuration.auth.expirationDuration.value,
                                Configuration.auth.expirationDuration.unit
                            ).format('X')),
                        }, Configuration.auth.jwtSecret);

                        callback(undefined, jwt);
                    },
                ], err => callback(err));
            })
            .catch(callback);
    }

    /**
     * Create and record an authentication fingerprint into the database.
     *
     * @private
     * @param {Account} account
     * @param {function(err: Error, authToken: string)} callback
     */
    recordAuthFingerprint(account, callback) {
        const buffer = crypto.randomBytes(32);
        const authToken = buffer.toString('hex');

        const now = moment();
        Database.query('INSERT INTO public.user_auth VALUES($1, $2, $3, $4, $5, $6)', [
            authToken,
            account.getToken(),
            now.toISOString(),
            now.add(
                Configuration.auth.expirationDuration.value,
                Configuration.auth.expirationDuration.unit
            ).toISOString(),
            this._request.headers['x-forwarded-for'] ||
            this._request.connection.remoteAddress,
            JSON.stringify(this._request.useragent),
        ])
            .then(() => callback(undefined, authToken))
            .catch(callback);
    }

    /**
     * Verify an authentication fingerprint based on the request JWT data.
     *
     * @param jwtData
     * @param {function(err: Error, valid: boolean?)} callback
     */
    verifyAuthFingerprint(jwtData, callback) {
        Database.query(
            'SELECT * FROM public.user_auth WHERE auth_token = $1',
            [ jwtData.authToken ]
        ).then(result => {
            if (!result.rowCount) {
                return callback(new Error('Token not found'));
            }

            const row = result.rows[0];

            const now = moment();
            const expireMoment = moment(row.exp_time);
            const remoteIp = this._request.headers['x-forwarded-for'] ||
                this._request.connection.remoteAddress;

            if (row.logout) {
                return callback({
                    type: 'tokenExpired',
                    message: 'The provided token has been manually invalidated by logging out',
                });
            }
            if (!now.isBefore(expireMoment)) {
                return callback({
                    type: 'tokenExpired',
                    message: `The provided token has expired on ${expireMoment.toString()}`,
                });
            }
            if (jwtData.accountToken !== row.owner) {
                return callback({
                    type: 'tokenOwnerInvalid',
                    message: 'Someone else owns this token',
                });
            }
            if (remoteIp !== row.ip) {
                return callback({
                    type: 'invalidClient',
                    message: 'The token is owned by a different client',
                });
            }

            callback(undefined, true);
        }).catch(callback);
    }

    /**
     * Read the request data and check the identity of the remote user, if any.
     * This will ensure that the request comes from an authenticated and authorized
     * user.
     *
     * @param {function(err: Error?, account: Account?)} callback
     */
    verifyIdentity(callback) {
        if (typeof callback !== 'function') {
            throw new Error('Callback must be a function.');
        }

        const request = this._request;
        const jwt = request.cookies[Configuration.auth.cookieName];

        if (!jwt) {
            callback(undefined, null);
            return;
        }

        try {
            const jwtData = JWT.verify(jwt, Configuration.auth.jwtSecret);

            this.verifyAuthFingerprint(jwtData, (err, valid = false) => {
                if (!valid) {
                    return callback(err);
                }

                const accountsRepo = new AccountsRepository();
                accountsRepo.getAccount({
                    id: jwtData.accountToken,
                }, callback);
            });
        } catch (err) {
            callback(err);
        }
    }

    /**
     * Logout a user by the server request.
     *
     * @param {function(err: Error?)} callback
     */
    logout(callback) {
        if (typeof callback !== 'function') {
            callback = () => {};
        }

        const request = this._request;
        const jwt = request.cookies[Configuration.auth.cookieName];

        if (!jwt) {
            callback();
            return;
        }

        try {
            const jwtData = JWT.verify(jwt, Configuration.auth.jwtSecret);

            async.waterfall([
                (next) => this.verifyAuthFingerprint(jwtData, next),
                (valid, next) => Database.query(
                    'UPDATE public.user_auth SET logout = TRUE WHERE auth_token = $1',
                    [ jwtData.authToken ],
                    (err, res) => next(err)
                ),
                () => callback(),
            ], err => callback(err));
        } catch (err) {
            return callback(err);
        }
    }

}

module.exports = AuthManager;
