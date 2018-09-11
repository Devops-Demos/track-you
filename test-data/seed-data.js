const exec = require('child_process')
  .exec;
const path = require('path');

const dbOptions = require('../config/local')
  .connections.dbTest;

const dumpFile = path.resolve('./test-data/dbdata.psql');
const sessionInitFile = path.resolve('./node_modules/sails-pg-session/sql/sails-pg-session-support.sql');

// const command = `PGPASSWORD="${dbOptions.password}" psql -h ${dbOptions.host} -U ${dbOptions.user}  -d "${dbOptions.database}" -f ${dumpFile} && PGPASSWORD="${dbOptions.password}" psql -h ${dbOptions.host} -U ${dbOptions.user}  -d "${dbOptions.database}" < ${sessionInitFile}`;
const command = `PGPASSWORD="${dbOptions.password}" psql -h ${dbOptions.host} -U ${dbOptions.user}  -d "${dbOptions.database}" -f ${dumpFile}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  process.exit();
});
