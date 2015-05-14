#!/usr/bin/env node

var cwd = process.cwd();
var Watcher = require('./index.js');

new Watcher(cwd).watch();
