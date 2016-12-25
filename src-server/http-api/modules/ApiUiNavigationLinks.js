import HttpApiModule from 'HttpApiModule';

class ApiUiNavigationLinks extends HttpApiModule {
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
                { label: 'Login', to: '/login' },
            ],
        });
        res.end();
    }
}

module.exports = ApiUiNavigationLinks;
