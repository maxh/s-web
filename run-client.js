var yargs = require('yargs').argv;

const args = [ yargs.command ];
const opts = { stdio: 'inherit', cwd: 'client', shell: true };
require('child_process').spawn('npm', args, opts);
