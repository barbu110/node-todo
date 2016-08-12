import React from 'react';
import 'styles/components/Core';

export default class App extends React.Component {
    static propTypes = {
        children: React.PropTypes.any.isRequired,
    };

    render() {
        const { children } = this.props;

        return <div>{children}</div>;
    }
}
