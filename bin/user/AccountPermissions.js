const _ = require('underscore');
const PermissionsConstants = require('./PermissionsConstants');

class AccountPermissions {

    /**
     * Create a set of permissions from an object in form of:
     *
     *     {
     *         permission1: true,
     *         permission2: false,
     *     }
     *
     * @param obj
     */
    constructor(obj) {
        const permissionNames = _.keys(PermissionsConstants);

        _.each(obj, (item, index) => {
            if (_.indexOf(permissionNames, index) === -1) {
                throw new Error(`Unknown permission "${index}".`);
            }
            if (typeof item !== 'boolean') {
                throw new Error('Permissions can be either "true" or "false"');
            }
        });

        let allPermissions = {};
        permissionNames.forEach(permission => {
            allPermissions[permission] = false;
        });

        this._permissions = Object.assign({}, allPermissions, obj);
    }

    /**
     * Get the base 10 conversion of the binary representation.
     *
     * @return {number}
     */
    convertToNumber() {
        const keys = _.keys(this._permissions);
        const permissions = keys
            .filter(item => this._permissions[item] === true)
            .map(item => PermissionsConstants[item]);

        let numericPermissions = 0;
        permissions.forEach(flag => numericPermissions |= flag);

        return numericPermissions;
    }

    /**
     * Create an Account permissions object from a decimal representation of the binary mask.
     *
     * @param mask
     * @return {AccountPermissions}
     */
    static convertFromNumber(mask) {
        let invertedPermissions = {};
        _.forEach(PermissionsConstants, (item, index) => invertedPermissions[item] = index);

        let permissions = {};
        _.forEach(PermissionsConstants, item => {
            permissions[invertedPermissions[item]] = (mask & item) === item;
        });

        return new AccountPermissions(permissions);
    }

    /**
     * Assign a set of partial data to the current permissions.
     *
     * @param partialData
     */
    setPermissions(partialData) {
        const permissionNames = _.keys(PermissionsConstants);

        _.each(partialData, (item, index) => {
            if (_.indexOf(permissionNames, index) === -1) {
                throw new Error(`Unknown permission "${index}".`);
            }
            if (typeof item !== 'boolean') {
                throw new Error('Permissions can be either "true" or "false"');
            }
        });

        this._permissions = Object.assign({}, this._permissions, partialData);
    }

    setPermission(key, enabled) {
        const permissionNames = _.keys(PermissionsConstants);
        if (_.indexOf(permissionNames, key) === -1) {
            throw new Error(`Unknown permissions identifier "${key}"`);
        }

        this._permissions = Object.assign({}, this._permissions, {
            [key]: enabled,
        });
    }

    getPermission(key) {
        const permissionNames = _.keys(PermissionsConstants);
        if (_.indexOf(permissionNames, key) === -1) {
            throw new Error(`Unknown permission identifier "${key}"`);
        }

        return this._permissions[key];
    }

}

module.exports = AccountPermissions;
