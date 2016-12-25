/**
 * @providesModule WhiteBar/Core
 * @flow
 */

import React from 'react';
import CSSModules from 'react-css-modules';
import PageSizer from 'PageSizer';
import Logo from 'SvgIcons/Logo';
import IndexLink from 'react-router/lib/IndexLink';
import NavigationLink from 'WhiteBar/NavigationLink';

import NavigationStore from 'NavigationStore';
import * as NavigationActions from 'NavigationActions';

import styles from 'styles/components/WhiteBar/Core';

@CSSModules(styles, { allowMultiple: true })
export default class WhiteBar extends React.Component {
    state = {
        loading: true,
    };

    componentWillMount() {
        NavigationActions.getNavigationLinks();
        NavigationStore.addChangeListener(this.handleNavigationLinksChange);
    }

    componentWillUnmount() {
        NavigationStore.removeChangeListener(this.handleNavigationLinksChange);
    }

    handleNavigationLinksChange = () => this.setState({
        loading: NavigationStore.isLoading(),
        links: NavigationStore.getAllLinks(),
    })

    render() {
        const { loading, links } = this.state;

        return (
            <div styleName="WhiteBar">
                <PageSizer>
                    <div styleName="presenter">
                        <div styleName="pushLeft fit">
                            <IndexLink to="/"><Logo/></IndexLink>
                        </div>
                        <div styleName="pushRight">
                            {loading ? 'Loading...' : links.map(link => (
                                <NavigationLink key={link.label} link={link.to} label={link.label} />
                            ))}
                        </div>
                    </div>
                </PageSizer>
            </div>
        );
    }
}
