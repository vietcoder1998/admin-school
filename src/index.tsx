import React from 'react';
import ReactDOM from 'react-dom';
import './app/view/scss/_keyFrame.scss';
import './app/view/scss/_common.scss'
import App from './App';
import ErrorBoundary from './app/view/layout/common/ErrorBoudary';
import * as serviceWorker from './serviceWorker';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "antd/dist/antd.css";
require('dotenv').config();

const rootEl = document.getElementById('root');
const appRenderer = Component => ReactDOM.render(
    <ErrorBoundary >
        <Component />
    </ErrorBoundary>, rootEl);

appRenderer(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
