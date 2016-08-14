const ApiModule = require('../../../bin/http-api/ApiModule');

class Module3 extends ApiModule {
    constructor() {
        super();

        this.enforceAuthentication();
        this.setRoute('/module3');
    }

    execute(req, res) {
        res.send('Module3');
        res.end();
    }
}

module.exports = Module3;
