var findit = require('findit');

function Watcher(path) {
  this.path = path;
}

Watcher.prototype.watch = function() {
  var finder = findit(this.path);
  
  finder.on('directory', function(dir, stat, stop) {
    console.log(dir);
  });

  finder.on('file', function(file, stat) {
    console.log(file);
  });
}

module.exports = Watcher;
