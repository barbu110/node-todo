/**
 * @providesModule NavigationActions
 * @flow
 */

import request from 'superagent/lib/client';
import AppDispatcher from 'AppDispatcher';
import ActionNames from 'ActionNames';

export function getNavigationLinks() {
    AppDispatcher.dispatch({
        actionType: ActionNames.FETCH_NAVIGATION_LINKS,
    });

    request('GET', '/api/ui/navigation/links')
        .then((response: Object) => {
            const data = response.body;

            AppDispatcher.dispatch({
                actionType: ActionNames.RECEIVE_NAVIGATION_LINKS,
                ...data,
            });
        })
        .catch((err: Object) => AppDispatcher.dispatch({
            actionType: ActionNames.FETCH_SERVER_DATA_FAIL,
            ...err,
        }));
}
