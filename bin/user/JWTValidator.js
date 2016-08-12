const AccountsRepository = require('./AccountsRepository');
const moment = require('moment');

class JWTValidator {

    /**
     * Construct a JWTValidator and start validating the JWT data.
     *
     * @param request Express request object.
     * @param database PostgreSQL client
     * @param jwtData Decoded JWT data.
     * @param finishCb Callback of the validation.
     */
    constructor(request, database,  jwtData, finishCb) {
        this._request = request;
        this._database = database;
        this._jwtData = jwtData;

        this.validateAuthToken(finishCb);
    }

    validateAuthToken(cb) {
        const reader = this._database.query({
            text: 'SELECT * FROM public.user_auth WHERE auth_token = $1',
            values: [
                this._jwtData.authToken,
            ],
        });

        reader.on('row', row => {
            const now = moment();
            const expireMoment = moment(row.exp_time);
            const remoteIp = this._request.headers['x-forwarded-for'] ||
                    this._request.connection.remoteAddress;

            if (row.logout) {
                return cb({
                    type: 'tokenExpired',
                    message: 'The provided token has been manually invalidated by logging out',
                });
            }
            if (!now.isBefore(expireMoment)) {
                return cb({
                    type: 'tokenExpired',
                    message: `The provided token has expired on ${expireMoment.toString()}`,
                });
            }
            if (this._jwtData.accountToken !== row.owner) {
                return cb({
                    type: 'tokenOwnerInvalid',
                    message: 'Someone else owns this token',
                });
            }
            if (remoteIp !== row.ip) {
                return cb({
                    type: 'invalidClient',
                    message: 'The token is owned by a different client',
                });
            }

            const accountsRepo = new AccountsRepository();

            accountsRepo.getAccount(
                { id: this._jwtData.accountToken },
                account => cb(undefined, account)
            );
        });
    }

}

module.exports = JWTValidator;
