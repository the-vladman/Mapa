import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import enMessages from '@boundlessgeo/sdk/locale/en';
import { IntlProvider } from 'react-intl';

var locale = 'en';
var i18n = enMessages;

ReactDOM.render(<IntlProvider locale={locale} messages={i18n}><App /></IntlProvider>, document.getElementById('root'));
registerServiceWorker();
