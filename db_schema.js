// const repl = require("repl");
// const replServer = repl.start({ prompt: "my-app > " });

const Parse = require("parse/node").Parse;
Parse.serverURL = "http://please-api.herokuapp.com/parse";
Parse.initialize("myAppId", "RESTKEY", "myMasterKey");

Parse.Schema.all().then(res => {
  console.log(res);
});

//replServer.context.promise = promise;
