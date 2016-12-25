/**
 * @providesModule NavigationStore
 * @flow
 */

import EventEmitter from 'events';
import AppDispatcher from 'AppDispatcher';
import ActionNames from 'ActionNames';
import SessionStateStore from 'SessionStateStore';

const CHANGE_EVENT = 'change';

let _navigationItems = [];
let _loading = true;

class NavigationStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    addChangeListener(callback: Function) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback: Function) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    isLoading() {
        return _loading;
    }

    getAllLinks() {
        return _navigationItems;
    }
}

const navigationStore = new NavigationStore();
navigationStore.dispatchToken = AppDispatcher.register((action: Object) => {
    AppDispatcher.waitFor([ SessionStateStore.dispatchToken ]);

    switch (action.actionType) {
    case ActionNames.FETCH_NAVIGATION_LINKS:
        break;
    case ActionNames.RECEIVE_NAVIGATION_LINKS:
        const { links } = action;

        _loading = false;
        _navigationItems = links;

        navigationStore.emitChange();
        break;
    default:
        break;
    }
});

export default navigationStore;
