/**
 * @providesModule UITest
 * @flow
 */

import React from 'react';
import PageSizer from 'PageSizer';
import Button from 'Button';
import PageTitle from 'PageTitle';

export default class UITest extends React.Component {
    state = {
        logoutDisabled: false,
    };

    render() {
        const paragraphStyles = {
            marginTop: 0,
            marginBottom: 32,
            padding: 0,
        };
        const { logoutDisabled } = this.state;

        return (
            <PageSizer hasPadding={true}>
                <PageTitle>User Interface New Playground</PageTitle>
                <p style={paragraphStyles}>
                    This is a UI Framework testing page.
                </p>
                <div>
                    <Button caption="Toggle" onClick={() => this.setState({ logoutDisabled: !logoutDisabled })} />
                    <Button caption="Logout" disabled={logoutDisabled} style={{ marginLeft: 8 }} backgroundColor="#bdbdbd" labelColor="#ffffff" />
                </div>
            </PageSizer>
        );
    }
}
