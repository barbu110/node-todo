const ApiModule = require('../ApiModule');
const Configuration = require('../../../config.json');
const AuthManager = require('../../user/AuthManager');

class UserLogout extends ApiModule {

    constructor() {
        super();

        this.setMethod('post');
        this.setRoute('/user/logout');
    }

    execute(req, res) {
        const authManager = new AuthManager(req);
        authManager.logout(err => {
            if (err) {
                console.error('Failed to log out: ', err);
            }

            res.clearCookie(Configuration.auth.cookieName);
            res.json({
                success: err ? false : true,
            });
            res.end();
        });
    }

}

module.exports = UserLogout;
