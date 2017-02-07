// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

require('angular');

global.CodeMirror =
	require('codemirror/lib/codemirror');

require('fs').readdirSync('node_modules/codemirror/mode')
	.forEach((file) => {
		if (!file.match(/\.js$/)) {
			let name = file.replace('.js', '');
			require(`codemirror/mode/${name}/${name}`);
		}
	});

require('codemirror/mode/meta');
require('./assets/language/eelscript');
require('./app.js');
require('./inputHighlight/inputHighlight.dir.js');
require('./mainComponent/mainComponent.js');
require('./resultDisplay/resultDisplay.dir.js');
