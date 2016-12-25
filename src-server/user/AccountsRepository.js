/**
 * @providesModule AccountsRepository
 */

import crypto from 'crypto';
import underscore from 'underscore';
import Database from 'Database';
import Account from 'Account';
import Password from 'Password';

export default class AccountsRepository {

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

        Database('user').insert({
            id: account.getToken(),
            username: account.getUsername(),
            password: Password.encryptSync(password),
            profile_pic: null,
            firstname: account.getFirstName(),
            lastname: account.getLastName(),
        })
            .then(() => callback(undefined, account))
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

        Database('user').where({ [criterion]: filterValue }).select().then(rows => {
            if (rows.length === 0) {
                return callback(new Error('Account was not found'));
            }

            const row = rows[0];
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
