/**
 * @providesModule Page
 * @flow
 */

import React from 'react';
import CSSModules from 'react-css-modules';

import styles from 'styles/components/Page';

@CSSModules(styles)
export default class Page extends React.Component {
    props: {
        children: mixed,
    };

    render() {
        console.log('Instantiated page');
        const { children } = this.props;

        return (
            <div styleName="page">
                {children}
            </div>
        );
    }
}
