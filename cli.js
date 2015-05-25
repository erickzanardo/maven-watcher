#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var cwd = process.cwd();
var Watcher = require('./index.js');

var args = process.argv;
var mode = args[args.length - 1];

var currentModes = ['webapp', 'jar'];
if(currentModes.indexOf(mode) == -1) {
  mode = 'webapp';
}

var pomPath = path.join(cwd, 'pom.xml').toString();
fs.open(pomPath, "r+", function(error) {
  if(!error) {
    new Watcher(cwd).watch(mode);
    console.log('Watching in ' + mode + ' mode');
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

process.on('uncaughtException', function(err) {
  console.log('Something wrong happend: ' + err);
});
