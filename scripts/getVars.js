const fs = require('fs');

var pkgContents = fs.readFileSync("./angular.json");
const project = JSON.parse(pkgContents).defaultProject;
const projectPath = './dist/' + project;
const { path7za } = require('7zip-bin');

if (!fs.existsSync(projectPath)) {
  throw "Project output directory not found";
}

exports.project = project;
exports.projectPath = projectPath;
exports.projectZipFile = project + '.zip';
exports.path7za = path7za;