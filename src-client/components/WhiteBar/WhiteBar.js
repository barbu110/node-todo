import React from 'react';
import CSSModules from 'react-css-modules';
import PageSizer from 'components/PageSizer';
import Logo from 'components/SvgIcons/Logo';
import IndexLink from 'react-router/lib/IndexLink';
import NavigationLink from 'components/WhiteBar/NavigationLink';

import NavigationStore from 'stores/NavigationStore';
import * as NavigationActions from 'actions/NavigationActions';

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
