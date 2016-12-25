/**
 * @providesModule Button
 * @flow
 */

import React from 'react';
import CSSModules from 'react-css-modules';

import cx from 'cx';
import condObj from 'condObj';
import styles from 'styles/components/Button/Core';

@CSSModules(styles, { allowMultiple: true })
export default class Button extends React.Component {
    props: {
        id: ?string,
        caption: string,
        disabled: boolean,
        backgroundColor: ?string,
        labelColor: ?string,
        onClick: Function,
    };

    static defaultProps = {
        onClick: () => {},
        disabled: false,
        style: {},
    };

    render() {
        const {
            caption,
            disabled,
            backgroundColor,
            labelColor,
            onClick,
            style,
            styles, // eslint-disable-line no-unused-vars
            ...others,
        } = this.props;

        const buttonClass = cx({
            Button: true,
            disabled,
        });

        let buttonStyle = condObj({
            backgroundColor,
            color: labelColor,
        });
        buttonStyle = {
            ...buttonStyle,
            ...style,
        };

        return (
            <div
                styleName={buttonClass}
                style={buttonStyle}
                onClick={onClick}
                {...others}>
                {caption}
            </div>
        );
    }
}
