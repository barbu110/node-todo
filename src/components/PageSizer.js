import React from 'react';
import CSSModules from 'react-css-modules';

import classnames from 'classnames';
import styles from 'styles/components/PageSizer';

@CSSModules(styles, { allowMultiple: true })
export default class PageSizer extends React.Component {
    static propTypes = {
        hasPadding: React.PropTypes.bool,
    };

    static defaultProps = {
        hasPadding: false,
    };

    render() {
        const { hasPadding, children } = this.props;
        const styleNames = classnames({
            'pageSizer': true,
            hasPadding,
        });
        return (
            <div styleName={styleNames}>{children}</div>
        );
    }
}
