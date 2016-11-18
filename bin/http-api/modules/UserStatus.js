const ApiModule = require('../ApiModule');
const AuthManager = require('../../user/AuthManager');

class UserStatus extends ApiModule {

    constructor() {
        super();

        this.setMethod('get');
        this.setRoute('/user/status');
    }

    execute(req, res) {
        const authManager = new AuthManager(req);
        authManager.verifyIdentity((err, account) => {
            let output = {
                isAuthenticated: false,
            };

            if (account) {
                output = {
                    isAuthenticated: true,
                    account: {
                        accountToken: account.getToken(),
                        username: account.getUsername(),
                        firstName: account.getFirstName(),
                        lastName: account.getLastName(),
                        profilePicture: account.getProfilePicture(),
                        permissions: account.getPermissions()._permissions,
                    },
                };
            }

            res.json(output);
            res.status(200);
            res.end();
        });
    }

}

module.exports = UserStatus;
