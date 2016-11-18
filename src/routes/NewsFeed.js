import React from 'react';
import PageSizer from 'components/PageSizer';
import Link from 'react-router/lib/Link';

export default class NewsFeed extends React.Component {
    render() {
        return (
            <PageSizer hasPadding={true}>
                <div>This the news feed. Or will be...</div>
                <div><Link to="/create">Create something</Link></div>
            </PageSizer>
        );
    }
}
