/**
 * @providesModule AuthManager
 */

/*eslint no-console:0 */

import Database from 'Database';
import Password from 'Password';
import JWT from 'jsonwebtoken';
import Configuration from 'Configuration';
import AccountsRepository from 'AccountsRepository';
import moment from 'moment';
import crypto from 'crypto';
import async from 'async';

/**
 * Authentication manager for user accounts.
 */
export default class AuthManager {

    /**
     * Construct the authentication manager.
     * @param  {express.Request} request The web request.
     */
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
        Database('user').where({ username }).select('password')
            .then(rows => {
                if (rows.length === 0) {
                    callback(new Error('The account does not exist'));
                }

                const row = rows[0];
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
        Database('user_auth').insert({
            auth_token: authToken,
            owner: account.getToken(),
            gen_time: now.toISOString(),
            exp_time: now.add(
                Configuration.auth.expirationDuration.value,
                Configuration.auth.expirationDuration.unit
            ).toISOString(),
            ip: this._request.headers['x-forwarded-for'] || this._request.connection.remoteAddress,
            client_info: JSON.stringify(this._request.useragent),
        })
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
        Database('user_auth').where({ auth_token: jwtData.authToken }).select().then(rows => {
            if (rows.length === 0) {
                return callback(new Error('Token not found'));
            }

            const row = rows[0];

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
                (valid, next) => Database('user_auth')
                .where({ auth_token: jwtData.authToken })
                .update({ logout: true })
                .then(() => next())
                .catch(next),
            ], err => callback(err));
        } catch (err) {
            return callback(err);
        }
    }

}
