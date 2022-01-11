const fs = require('fs');

exports.deleteFile = function (path) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}