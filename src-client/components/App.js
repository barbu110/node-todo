/**
 * @providesModule App
 */

import React from 'react';
import WhiteBar from 'WhiteBar';
import Page from 'Page';

import * as SessionStateActions from 'SessionStateActions';

import 'styles/components/Core';

export default class App extends React.Component {
    props: {
        children: mixed,
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
