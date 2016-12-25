/**
 * @providesModule SessionStateStore
 * @flow
 */

import EventEmitter from 'events';
import AppDispatcher from 'dispatchers/AppDispatcher';
import ActionNames from 'actions/ActionNames';

const CHANGE_EVENT = 'change';

let _sessionState = {
    present: false,
};

class SessionStateStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback: Function) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback: Function) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    isAuthenticated() {
        return _sessionState.present;
    }

    getSessionUser() {
        if (this.isAuthenticated()) {
            return _sessionState.account;
        }
        return null;
    }
}

const sessionStateStore = new SessionStateStore();
sessionStateStore.dispatchToken = AppDispatcher.register((action: Object) => {
    switch (action.actionType) {
    case ActionNames.FETCH_SESSION_STATE:
        break;
    case ActionNames.RECEIVE_SESSION_STATE:
        const { present, account } = action;
        _sessionState = {
            present,
            account,
        };

        sessionStateStore.emitChange();
        break;
    default:
        break;
    }
});


export default sessionStateStore;
