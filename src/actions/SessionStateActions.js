import request from 'superagent/lib/client';
import AppDispatcher from 'dispatchers/AppDispatcher';
import ActionNames from 'actions/ActionNames';
import Account from 'bin/user/Account';

export function getSessionState() {
    AppDispatcher.dispatch({
        actionType: ActionNames.FETCH_SESSION_STATE,
    });

    request('GET', '/api/user/status')
        .then(data => {
            const responseData = data.body;
            const isAuthenticated = responseData.isAuthenticated || false;
            const accountData = responseData.account;

            let account = undefined;
            if (isAuthenticated) {
                account = new Account();

                account.setToken(accountData.accountToken);
                account.setUsername(accountData.username);
                account.setFirstName(accountData.firstName);
                account.setLastName(accountData.lastName);
                account.setProfilePicture(accountData.profilePicture);
                account.setPermissions(accountData.permissions);
            }

            AppDispatcher.dispatch({
                actionType: ActionNames.RECEIVE_SESSION_STATE,
                isAuthenticated,
                account,
            });
        })
        .catch(err => AppDispatcher.dispatch({
            actionType: ActionNames.FETCH_SERVER_DATA_FAIL,
            err,
        }));
}
