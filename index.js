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
    this.artifactId = $('project > artifactId').text();
    this.version = $('project > version').text();
    done.apply(this);
  }.bind(this));
};

Watcher.prototype.readRootFolder = function() {
  if(this.mode == 'webapp') {
    var targetFolder = [this.artifactId, this.version].join('-');
    this.targetPath = path.join(this.path, 'target', targetFolder);
    var resourcesPath = path.join(this.path.toString(), 'src', 'main', 'resources');
    var resourcesPathDest = path.join(this.targetPath.toString(), 'WEB-INF', 'classes');

    new FolderTransporter(resourcesPath, resourcesPathDest).beginTransport();

    var webappPath = path.join(this.path, 'src', 'main', 'webapp');
    var webappPathDest = this.targetPath;

    new FolderTransporter(webappPath, webappPathDest).beginTransport();
  } else {
    var resourcesPath = path.join(this.path.toString(), 'src', 'main', 'resources');
    var resourcesPathDest = path.join(this.path.toString(), 'target', 'classes');
    new FolderTransporter(resourcesPath, resourcesPathDest).beginTransport()
  }
};

Watcher.prototype.watch = function(mode) {
  this.mode = mode;
  this.parseTargetFolder(this.readRootFolder);
}

module.exports = Watcher;
