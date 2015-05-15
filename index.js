var cheerio = require('cheerio')
  , fs = require('fs')
  , path = require('path')
  , FolderTransporter = require('./folder-transporter.js');

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
  var resourcesPath = path.join(this.path.toString(), 'src', 'main', 'resources');
  var resourcesPathDest = path.join(this.targetPath.toString(), 'WEB-INF', 'classes');

  new FolderTransporter(resourcesPath, resourcesPathDest).beginTransport();

  var webappPath = path.join(this.path, 'src', 'main', 'webapp');
  var webappPathDest = this.targetPath;

  new FolderTransporter(webappPath, webappPathDest).beginTransport();
};

Watcher.prototype.watch = function() {
  this.parseTargetFolder(this.readRootFolder);
}

module.exports = Watcher;
