const ApiModule = require('../ApiModule');
const Configuration = require('../../../config.json');
const AuthManager = require('../../user/AuthManager');

class UserLogin extends ApiModule {

    constructor() {
        super();

        this.setMethod('post');
        this.setRoute('/user/login');
    }

    execute(req, res) {
        const { username, password } = req.body;

        const authManager = new AuthManager(req);
        authManager.authenticate(username, password, (account, jwt) => {
            res.cookie(Configuration.auth.cookieName, jwt);
            res.json({
                success: true,
            });
            res.end();
        });
    }

}

module.exports = UserLogin;
