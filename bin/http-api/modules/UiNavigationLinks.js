const ApiModule = require('../ApiModule');

class UiNavigationLinks extends ApiModule {
    constructor() {
        super();

        this.setMethod('get');
        this.setRoute('/ui/navigation/links');
    }

    execute(req, res) {
        res.json({
            links: [
                { label: 'News', to: '/' },
                { label: 'Create', to: '/create' },
            ],
        });
        res.end();
    }
}

module.exports = UiNavigationLinks;
