/**
*	This file is required by the index.html file
*	and will be executed in the renderer process
*	for that window.
*
*	All of the Node.js APIs are available in this
*	process.
*
*	@author André Barata
*/

const Highland	= require('highland');
const path		= require('path');
const hook		= require('node-hook');

//TODO: Replace this id:16
// Loading the syntaxes
// Highland.wrapCallback(
// 	require('fs').readdir
// )(path.join(__dirname, '../../node_modules/codemirror/mode'))
// 	.flatten()
// 	.filter((file) => !file.match(/\.js$/))
//  	.each((file) => {
// 		let name = file.replace('.js', '');
// 		require(`codemirror/mode/${name}/${name}`);
// 	});

hook.hook('.vue', function (module, filename) {
	const vuetojs = require('vue-to-js');

	return vuetojs.generateCode(filename, 'commonjs');
});

hook.hook('.css', function (module, filename) {
	return `
		let style = document.createElement('link');

		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('type', 'text/css');
		style.setAttribute('href', '${filename}');

		document.head.appendChild(style);

		module.exports = style;
	`;
});

require('./assets/languages/eelscript');

global.scrollDown = () => {
	window.scrollTo(0, document.body.scrollHeight);
}
