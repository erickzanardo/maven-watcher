var findit = require('findit')
  , cheerio = require('cheerio')
  , fs = require('fs')
  , path = require('path');

function Watcher(path) {
  this.path = path;
}

Watcher.prototype.parseTargetFolder = function(done) {
  var pomPath = path.join(this.path, 'pom.xml');
  fs.readFile(pomPath, function(err, data) {
    $ = cheerio.load(data);
    var artifactId = $('project > artifactId').text();
    var version = $('project > version').text();
    var targetFolder = [artifactId, version].join('-');
    this.targetPath = path.join(this.path, 'target', targetFolder);
    done.apply(this);
  }.bind(this));
};

Watcher.prototype.readRootFolder = function() {
  var finder = findit(this.path);

  // TODO find src/main/resources
  // TODO find src/main/webapp
  
  finder.on('directory', function(dir, stat, stop) {
    console.log(dir);
  });

  finder.on('file', function(file, stat) {
    console.log(file);
  });
};

Watcher.prototype.watch = function() {
  this.parseTargetFolder(this.readRootFolder);
}

module.exports = Watcher;
