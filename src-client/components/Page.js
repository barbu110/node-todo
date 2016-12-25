import React from 'react';
import CSSModules from 'react-css-modules';

import styles from 'styles/components/Page';

@CSSModules(styles)
export default class Page extends React.Component {
    static propTypes = {
        children: React.PropTypes.any.isRequired,
    };

    render() {
        const { children } = this.props;
        
        return (
            <div styleName="page">
                {children}
            </div>
        );
    }
}
