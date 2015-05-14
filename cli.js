#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var cwd = process.cwd();
var Watcher = require('./index.js');

var pomPath = path.join(cwd, 'pom.xml').toString();
fs.open(pomPath, "r+", function(error) {
  if(!error) {
    new Watcher(cwd).watch();
  } else {
    switch(error.code) {
      case "EACCES":
        console.error("Can't open", pomPath);
      break;
    default:
      console.error('This is not a Maven project')
    }
  }
});
