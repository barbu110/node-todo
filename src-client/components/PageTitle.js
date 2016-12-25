/**
 * @flow
 * @providesModule ui-PageTitle
 */

import React from 'react';
import CSSModules from 'react-css-modules';

import styles from 'styles/components/PageTitle';

@CSSModules(styles)
export default class PageTitle extends React.Component {
    props: {
        children: mixed
    };

    render() {
        const { children } = this.props;
        return (
            <div styleName="PageTitle">{children}</div>
        );
    }
}
