/**
 * @providesModule PageSizer
 * @flow
 */

import React from 'react';
import CSSModules from 'react-css-modules';

import cx from 'cx';
import styles from 'styles/components/PageSizer';

@CSSModules(styles, { allowMultiple: true })
export default class PageSizer extends React.Component {
    props: {
        hasPadding: boolean,
    };

    static defaultProps = {
        hasPadding: false,
    };

    render() {
        const { hasPadding, children } = this.props;
        const styleNames = cx({
            pageSizer: true,
            hasPadding,
        });

        return (
            <div styleName={styleNames}>{children}</div>
        );
    }
}
