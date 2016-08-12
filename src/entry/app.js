import React from 'react';
import ReactDOM from 'react-dom';
import WhiteBar from 'components/WhiteBar';
import PageSizer from 'components/PageSizer';
import App from 'components/App';

ReactDOM.render(
    <App>
        <WhiteBar/>
        <PageSizer hasPadding={true}>
            This is some stupid content.
        </PageSizer>
    </App>,
    document.getElementById('app')
);
