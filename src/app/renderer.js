// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

require('angular');

global.CodeMirror =
	require('codemirror/lib/codemirror');

const Highland = require('highland');

//TODO: Replace this id:16
// Loading the syntaxes
Highland.wrapCallback(
	require('fs').readdir
)('node_modules/codemirror/mode')
	.flatten()
	.filter((file) => !file.match(/\.js$/))
 	.each((file) => {
		let name = file.replace('.js', '');
		require(`codemirror/mode/${name}/${name}`);
	});

require('./assets/languages/eelscript');
require('./app.js');
require('./inputHighlight/inputHighlight.dir.js');
require('./streamDisplay/streamDisplay.dir.js');
require('./mainComponent/mainComponent.js');
require('./resultDisplay/resultDisplay.dir.js');
