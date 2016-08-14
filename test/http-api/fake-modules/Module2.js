const ApiModule = require('../../../bin/http-api/ApiModule');

class Module2 extends ApiModule {
    constructor() {
        super();

        this.setMethod('post');
        this.setRoute('/module2');
    }

    execute(req, res) {
        res.send('Module2');
        res.end();
    }
}

module.exports = Module2;
