import HttpApiModule from 'HttpApiModule';
import Configuration from 'Configuration';
import AuthManager from 'AuthManager';

class ApiUserLogin extends HttpApiModule {

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

module.exports = ApiUserLogin;
