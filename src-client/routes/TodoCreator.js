import React from 'react';
import PageSizer from 'components/PageSizer';

export default class TodoCreator extends React.Component {
    render() {
        return (
            <PageSizer hasPadding={true}>
                <div>This the todo creator feed. Or will be...</div>
            </PageSizer>
        );
    }
}
