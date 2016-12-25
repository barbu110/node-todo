/**
 * @providesModule WhiteBar/NavigationLink
 * @flow
 */

import React from 'react';
import Link from 'react-router/lib/Link';
import CSSModules from 'react-css-modules';

import styles from 'styles/components/WhiteBar/NavigationLink';

@CSSModules(styles)
export default class NavigationLink extends React.Component {
    props: {
        label: string,
        link: string,
        internalLink: boolean,
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
