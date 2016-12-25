/**
 * @providesModule TodoCreator
 * @flow
 */

import React from 'react';
import PageSizer from 'PageSizer';
import PageTitle from 'PageTitle';

export default class TodoCreator extends React.Component {
    render() {
        return (
            <PageSizer hasPadding={true}>
                <PageTitle>Write something</PageTitle>
                <p>Something in between</p>
                <div>This the todo creator. Or will be...</div>
            </PageSizer>
        );
    }
}
