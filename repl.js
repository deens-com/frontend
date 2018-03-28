const repl = require("repl");
const replServer = repl.start({ prompt: "my-app > " });
const Parse = require("parse/node").Parse;

Parse.serverURL = "http://api.please.docker/parse";
Parse.initialize("myAppId", "RESTKEY", "myMasterKey");

replServer.context.Parse = Parse;
