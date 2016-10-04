const repl = require('repl');
const vm = require('vm');

const system = require('./system');

let console = repl.start('> ');

console.context = vm.createContext(system({}));
