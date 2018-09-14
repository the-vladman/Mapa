import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import enMessages from '@boundlessgeo/sdk/locale/en';
import { IntlProvider } from 'react-intl';
import { BrowserRouter, Route } from 'react-router-dom';

var locale = 'en';
var i18n = enMessages;

ReactDOM.render(<IntlProvider locale={locale} messages={i18n}><BrowserRouter><Route path={'/'} component={App} /></BrowserRouter></IntlProvider>, document.getElementById('root'));
registerServiceWorker();
