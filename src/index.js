import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "./index.css";
import App from "./main/app";
import registerServiceWorker from "./registerServiceWorker";
import Parse from "parse";

Parse.initialize("myAppId");
Parse.serverURL = "http://api.please.docker/parse";
// process.env.REACT_APP_PARSE_SERVER_URL ||
// "http://please-api.herokuapp.com/parse"; //"http://api.please.com/parse";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
