var fs = require('fs')
  , ReadFolder = require('./rfolder.js')
  , path = require('path')
  , Strings = require('./strings.js');

var skip = [
  'WEB-INF'
];

var ignoreEndings = [
  'swp',
  '~'
];

function FolderTransporter(rootPath, rootDestPath) {
  this.rootPath = rootPath;
  this.rootDestPath = rootDestPath;
}

FolderTransporter.prototype.beginTransport = function() {
  // Watch this folder for changes
  fs.watch(this.rootPath, function (event, filename) {

    for(var i = 0; i < ignoreEndings.length; i++) {
      if(Strings.endsWith(filename, ignoreEndings[i])) {
        return;
      }
    }

    var fullpath = path.join(this.rootPath, filename);
    var destpath = path.join(this.rootDestPath, filename);

    if(event == 'rename') {
      // Check if the filename exists on root
      fs.exists(fullpath, function(exists) {
        if(exists) {
          // if exists create on dest
          fs.stat(fullpath, function(err, stats) {
            if(stats.isFile()) {
              fs.readFile(fullpath, function(err, data) {
                if(err) throw err;
                fs.writeFile(destpath, data);
                console.log('file: ' + fullpath + ' created ');
              });
            } else {
              console.log('no support for folders yet');
            }
          }.bind(this));
        } else {
          // if the filename doesn't exists, remove from dest
          fs.exists(destpath, function(exists) {
            if(exists) {
              fs.unlink(destpath);
              console.log('file/folder: ' + fullpath + ' deleted ');
            }
          });
        }
      }.bind(this));
    } else if (event == 'change') {
      // write file on dest
      fs.stat(fullpath, function(err, stats) {
        if(!err) {
          if(stats.isFile()) {
            fs.readFile(fullpath, function(err, data) {
              if(err) throw err;
                fs.writeFile(destpath, data);
                console.log('file: ' + fullpath + ' updated ');
              });
          } else {
            console.log('no support for folders yet');
          }
        }
      });
    }
  }.bind(this));

  // Look for all children folder in this folder
  var rfolder = new ReadFolder(this.rootPath.toString());
  rfolder.onFolder(function(fullpath, dir) {
    if(skip.indexOf(dir) == -1) {
      var childRootPath = path.join(this.rootPath, dir);
      var childRootDestPath = path.join(this.rootDestPath, dir);
      new FolderTransporter(childRootPath, childRootDestPath).beginTransport(); 
    }
  }.bind(this));
  rfolder.readFolders();
};

module.exports = FolderTransporter;
