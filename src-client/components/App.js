import React from 'react';
import WhiteBar from 'components/WhiteBar';
import Page from 'components/Page';

import * as SessionStateActions from 'actions/SessionStateActions';

import 'styles/components/Core';

export default class App extends React.Component {
    static propTypes = {
        children: React.PropTypes.any.isRequired,
    };

    componentWillMount() {
        SessionStateActions.getSessionState();
    }

    render() {
        const { children } = this.props;

        return (
            <div>
                <WhiteBar/>
                <Page>
                    {children}
                </Page>
            </div>
        );
    }
}
