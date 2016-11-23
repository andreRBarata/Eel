angular.module('termApp')
	.factory('Terminal', function() {
		var repl = require('repl');



		function Terminal() {
			this.shell = repl.start({
				prompt: '>',
				eval: (callback) => callback(null,cmd),
				writer: (output) => output.toUpperCase()
			});
		}

		Terminal.prototype.input = function (commandLine) {

		}

		return Terminal;
	});
