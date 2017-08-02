/**
*	Creates a link to a local path
*	when the element is clicked if the given
*	path is a file it is opened by the OS
*	if its a folder a cd command is ran for it
*	@author André Barata
*/
const opn	= require('opn');
const fs	= require('fs');

const commandService = require('../api/commandService');

module.exports = Vue.directive('localRef', (el, binding) => {

	el.addEventListener('click', () => {
		fs.stat(binding.value, (err, stat) => {
			let path = binding.value
				.replace(/\\/g,
					'\\\\'
				);

			if (stat.isDirectory()) {
				commandService.execute(`#cd "${
					path
				}"`);
			}
			else {
				opn(path);
			}

		});
	});
});
