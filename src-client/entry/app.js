import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';

import NewsFeed from 'NewsFeed';
import TodoCreator from 'TodoCreator';
import UITest from 'UITest';

import Router from 'react-router/lib/Router';
import IndexRoute from 'react-router/lib/IndexRoute';
import browserHistory from 'react-router/lib/browserHistory';
import Route from 'react-router/lib/Route';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={NewsFeed} />
            <Route path="create" component={TodoCreator} />
            <Route path="uiTest" component={UITest} />
        </Route>
    </Router>,
    document.getElementById('app')
);
