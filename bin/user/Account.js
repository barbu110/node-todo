const AccountPermissions = require('./AccountPermissions');

class Account {

    constructor() {}

    setToken(newToken) {
        if (newToken.length !== 32) {
            throw new Error('Invalid token format. The account token must be 32 bytes long');
        }

        this._token = newToken;
    }

    setUsername(newUsername) {
        this._username = newUsername;
    }

    setFirstName(newFirstName) {
        this._firstName = newFirstName;
    }

    setLastName(newLastName) {
        this._lastName = newLastName;
    }

    setProfilePicture(token) {
        this._profilePicture = token;
    }

    getToken() {
        return this._token;
    }

    getUsername() {
        return this._username;
    }

    getFirstName() {
        return this._firstName;
    }

    getLastName() {
        return this._lastName;
    }

    getDisplayName() {
        return `${this._firstName} ${this._lastName}`;
    }

    getProfilePicture() {
        return this._profilePicture;
    }

    setPermissions(input) {
        if (input instanceof AccountPermissions) {
            this._permissions = input;
        } else if (typeof input === 'object') {
            if (!this._permissions) {
                this._permissions = new AccountPermissions({});
            }
            this._permissions.setPermissions(input);
        } else if (typeof input === 'number') {
            this._permissions = AccountPermissions.convertFromNumber(input);
        }
    }

    getPermissions() {
        return this._permissions;
    }

    can(permissionKey) {
        return this._permissions.getPermission(permissionKey);
    }

    setPermission(key, value) {
        return this._permissions.setPermission(key, value);
    }

}

module.exports = Account;
