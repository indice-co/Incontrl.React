import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var root = document.getElementById('root');
var token = root.getAttribute('token');
var subscriptionid = root.getAttribute('subscription-id');
var doctypeid = root.getAttribute('doc-type-id');
var docid = root.getAttribute('doc-id');
var view = root.getAttribute('view');
var environment = root.getAttribute('environment');
var debug = root.getAttribute('debug');
ReactDOM.render(<App debug={debug} environment={environment} token={token} subscriptionid={subscriptionid} doctypeid={doctypeid} docid={docid} view={view} />, root);
registerServiceWorker();
