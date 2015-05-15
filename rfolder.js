var fs = require('fs')
  , path = require('path');

function ReadFolders(path) {
  this.path = path;
  this._onFolder = null;
}

ReadFolders.prototype.onFolder = function(callback) {
 this._onFolder = callback; 
};

ReadFolders.prototype.readFolders = function() {
  fs.readdir(this.path, function(err, entries) {
    if(err) throw err;
    entries.forEach(function(entry) {
      var fullpath = path.join(this.path, entry).toString();
      fs.stat(fullpath, function(err, stats) {
        if(err) throw err;
        if(stats.isDirectory()) {
          if(this._onFolder) this._onFolder(fullpath, entry);
        }
      }.bind(this));
    }.bind(this));
  }.bind(this));
};

module.exports = ReadFolders;
