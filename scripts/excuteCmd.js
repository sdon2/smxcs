const { exec } = require('child_process');

exports.executeCommand =  function(command) {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(`Node couldn't execute this command:\ncmd: ${command}`);
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
};