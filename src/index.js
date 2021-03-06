import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

var root = document.getElementById("root");
var token = root.getAttribute("token");
var client_credentials = root.getAttribute("client_credentials");
var subscriptionid = root.getAttribute("subscription-id");
var doctypeid = root.getAttribute("doc-type-id");
var docid = root.getAttribute("doc-id");
var view = root.getAttribute("view");
var environment = root.getAttribute("environment");
var debug = root.getAttribute("debug") || false;
var culture = root.getAttribute("culture");
var userlink = root.getAttribute("user-link");
var link = root.getAttribute("link");

ReactDOM.render(
  <App
    culture={culture}
    debug={debug}
    environment={environment}
    token={token}
    subscriptionid={subscriptionid}
    doctypeid={doctypeid}
    docid={docid}
    view={view}
    userlink={userlink}
    link={link}
    client_credentials={client_credentials}
  />,
  root
);

registerServiceWorker();
