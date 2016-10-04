const repl = require('repl');
const vm = require('vm');

const system = require('./system');

let console = repl.start('> ');

//#ForThisSprint:10 Find out provide access to standard js functions using a proxy context and implement it
//#ForThisSprint:0 Join outputed stream to standard output to have it display values
console.context = vm.createContext(system({}));
