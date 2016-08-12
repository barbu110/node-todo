const crypto = require('crypto');
const underscore = require('underscore');
const Database = require('../database');
const Account = require('./Account');
const Password = require('./Password');

class AccountsRepository {

    /**
     * Register a new account into the database. The callback function receives the account
     * object as the first parameter if the query is successful. Second parameter is the error.
     *
     * @param {{account: Account, password: string, callback: function(err: Error, account: Account?)}} data
     */
    registerAccount(data) {
        const registrationData = Object.assign({}, {
            callback: () => {},
        }, data);

        const { account, password, callback } = registrationData;
        account.setToken(this.generateToken());

        Database.query('INSERT INTO public.user VALUES($1, $2, $3, $4, $5, $6)', [
            account.getToken(),
            account.getUsername(),
            Password.encryptSync(password),
            null,
            account.getFirstName(),
            account.getLastName(),
        ])
            .then(result => {
                callback(
                    result.rowCount === 1 ? undefined : new Error('Registration failed'),
                    result.rowCount === 1 ? account : undefined
                );
            })
            .catch(callback);
    }

    /**
     * Get a single account from the database, filtered by unique keys.
     *
     * @param {Object} filter One of 'id', 'username'.
     * @param {function(err: Error, account: Account?)} callback
     */
    getAccount(filter, callback) {
        const criterion = underscore.keys(filter)[0];
        const filterValue = filter[criterion];

        if (underscore.indexOf([ 'id', 'username' ], criterion) === -1) {
            throw new Error('Selected column will not lead to unique result');
        }

        if (!callback || typeof callback !== 'function') {
            throw new Error('You cannot get an account without a callback');
        }

        Database.query(`SELECT * FROM public.user WHERE ${criterion} = $1`, [ filterValue ])
            .then(result => {
                if (!result.rowCount) {
                    return callback(new Error('Account was not found'));
                }

                const row = result.rows[0];
                const account = new Account();

                account.setToken(row.id);
                account.setUsername(row.username);
                account.setProfilePicture(row.profile_pic);
                account.setFirstName(row.firstname);
                account.setLastName(row.lastname);
                account.setPermissions(row.permissions);

                return callback(undefined, account);
            })
            .catch(callback);
    }

    /**
     * @returns {string} 32-bytes string
     * @private
     */
    generateToken() {
        const buffer = crypto.randomBytes(16);
        return buffer.toString('hex');
    }

}

module.exports = AccountsRepository;
