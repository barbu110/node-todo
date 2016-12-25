/**
 * @providesModule NewsFeed
 * @flow
 */

import React from 'react';
import PageSizer from 'PageSizer';
import PageTitle from 'PageTitle';
import Button from 'Button';
import Link from 'react-router/lib/Link';

export default class NewsFeed extends React.Component {
    render() {
        return (
            <PageSizer hasPadding={true}>
                <PageTitle>Newsfeed</PageTitle>
                <div>This the news feed. Or will be...</div>
                <p>
                    We are currently working on a <em>User Interface Toolkit</em>.
                </p>
                <div>
                    <Button caption="User Interface Playground" onClick={() => window.location.assign('/uiTest')} />
                </div>
            </PageSizer>
        );
    }
}
