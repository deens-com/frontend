import React from "react";
import ReactDOM from "react-dom";
import "./vendor/semantic.css";
import "./index.css";
import App from "./main/app";
import registerServiceWorker from "./registerServiceWorker";
import Parse from "parse";

Parse.initialize("myAppId");
Parse.serverURL =
  process.env.REACT_APP_PARSE_SERVER_URL || "http://api.please.docker/parse";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
