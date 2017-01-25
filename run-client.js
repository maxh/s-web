var yargs = require('yargs').argv;

const args = [ yargs.command ];
var env = Object.create(process.env);
env.NODE_ENV = yargs.env;
const opts = { stdio: 'inherit', cwd: 'client', shell: true, env: env };
require('child_process').spawn('npm', args, opts);
