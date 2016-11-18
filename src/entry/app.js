import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

import NewsFeed from 'routes/NewsFeed';
import TodoCreator from 'routes/TodoCreator';

import Router from 'react-router/lib/Router';
import IndexRoute from 'react-router/lib/IndexRoute';
import browserHistory from 'react-router/lib/browserHistory';
import Route from 'react-router/lib/Route';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={NewsFeed} />
            <Route path="create" component={TodoCreator} />
        </Route>
    </Router>,
    document.getElementById('app')
);
