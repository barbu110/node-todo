import React from 'react';
import Link from 'react-router/lib/Link';
import CSSModules from 'react-css-modules';

import styles from 'styles/components/WhiteBar/NavigationLink';

@CSSModules(styles)
export default class NavigationLink extends React.Component {
    static propTypes = {
        label: React.PropTypes.string.isRequired,
        link: React.PropTypes.string.isRequired,
        internalLink: React.PropTypes.bool,
    };

    static defaultProps = {
        internalLink: true,
    };

    render() {
        const { label, link, internalLink } = this.props;

        const tag = internalLink ? Link : 'a';
        const linkAttribute = internalLink ? 'to' : 'href';

        return React.createElement(tag, {
            [linkAttribute]: link,
            styleName: 'navigationLink',
        }, label);
    }
}
