const { path7za, projectPath, projectZipFile } = require("./getVars");
const { executeCommand } = require('./excuteCmd');
const { deleteFile } = require('./deleteFile');

deleteFile(projectPath + '/' + projectZipFile);

var createZipCommand = `cd ${projectPath} && ${path7za} a -r ${projectZipFile} ./`;
executeCommand(createZipCommand);