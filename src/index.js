import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";
import App from "./main/app";
import registerServiceWorker from "./registerServiceWorker";
import Parse from "parse";

Parse.initialize("myAppId");
Parse.serverURL = "https://api.please.docker/parse";
  // process.env.REACT_APP_PARSE_SERVER_URL ||
  // "https://please-api.herokuapp.com/parse";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
