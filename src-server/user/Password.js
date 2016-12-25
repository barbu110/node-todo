/**
 * @providesModule Password
 */

import bc from 'bcrypt';

export default class Password {
    /**
     * Encrypt a plaintext password string for safe storage.
     *
     * @param {string} passwordStr
     * @param {function(err, salt)} callback
     */
    static encrypt(passwordStr, callback) {
        bc.genSalt(10, (err, salt) => {
            if (err) {
                return callback(err);
            }

            bc.hash(passwordStr, salt, (err, hash) => callback(err, hash));
        });
    };

    /**
     * Sync encrypt a plaintext password string for safe storage.
     *
     * @param {string} passwordStr
     * @returns {string}
     */
    static encryptSync(passwordStr) {
        const salt = bc.genSaltSync(10);
        const hash = bc.hashSync(passwordStr, salt);

        return hash;
    }

    /**
     * Validate a plaintext password against a hash.
     *
     * @param {string} password
     * @param {string} hash
     * @param {function(err, isPassMatch = undefined)} callback
     */
    static validate(password, hash, callback) {
        bc.compare(password, hash, (err, isPassMatch) => {
            if (err) {
                return callback(err);
            }
            return callback(null, isPassMatch);
        });
    }

    /**
     * Syncronously validate a plaintext password against a hash.
     *
     * @param {string} password
     * @param {string} hash
     * @return {string}
     */
    static validateSync(password, hash) {
        return bc.compareSync(password, hash);
    }
}
