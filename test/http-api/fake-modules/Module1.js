const ApiModule = require('../../../bin/http-api/ApiModule');

class Module1 extends ApiModule {
    constructor() {
        super();

        this.setRoute('/module1');
    }

    execute(req, res) {
        res.send('Module1');
        res.end();
    }
}

module.exports = Module1;
