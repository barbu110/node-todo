import React from 'react';
import CSSModules from 'react-css-modules';
import PageSizer from 'components/PageSizer';
import Logo from 'components/SvgIcons/Logo';

import styles from 'styles/components/WhiteBar';

@CSSModules(styles)
export default class WhiteBar extends React.Component {
    render() {
        return (
            <div styleName="WhiteBar">
                <PageSizer>
                    <Logo/>
                </PageSizer>
            </div>
        );
    }
}
